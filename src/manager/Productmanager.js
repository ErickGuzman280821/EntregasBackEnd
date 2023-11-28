const initialProducts = [
    { title: "first item", description: "Product 1", code: "ABC", price: 200, stock: 0, thumbails: [""], category: "uncategorized", id: "", },

];

const fs = require('fs');
const crypto = require('crypto');

class ProductManager {
    constructor(path) {
        console.log("Product manager initialized");

        this.path = path;
        this.initialize();
    }

    async initialize() {
        const data = await this.readProductsFromFile();
        this.productArray = data || [];

    }


    generateID(product) {
        const idData = `${product.title}${product.price}${product.code}${product.description}${Math.random()}`;
        const hash = crypto.createHash('md5').update(idData).digest('hex');
        product.id = hash.toUpperCase();
    }

    validateProduct(product) {
        this.generateID(product);

        if (!product.title || !product.description || !product.code || !product.price || !product.category ||parseInt(product.price) <= 0 || parseInt(product.stock) < 0) {
           
            return false;
        }

        const isCodeDuplicate = this.productArray.some(prod => prod.code === product.code);
        const isIDDuplicate = this.productArray.some(prod => prod.id === product.id);

        if (isCodeDuplicate || isIDDuplicate) {
            return false;
        }


        product.status = true;
        return true;
    }

    async addProducts(data) {
        for (const product of data) {
            await this.addProduct(product);
        }
    }


    async addProduct(product) {
        console.log("Attempting to add...");

        if (this.validateProduct(product)) {
            this.productArray.push(product);

            await this.writeProductsToFile();

            if (product) {
                console.log(`The product ${product.title} has been added successfully`);
                return { success: true };
            }

        } else {
            console.log(`The product "${product.title}" (with code ${product.code}) and ID ${product.id} already exists`);
            return { success: false };
        }
    }

    async readProductsFromFile() {
        try {
            const data = await fs.promises.readFile(this.path, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            console.error('Error reading products file:', error.message);
            return null;
        }
    }

    async writeProductsToFile() {
        try {
            await fs.promises.writeFile(this.path, JSON.stringify(this.productArray, null, 2), { encoding: 'utf-8' });
        } catch (error) {
            console.error('Error writing products file:', error.message);
        }
    }

    async getProducts(limit) {
        try {
            const products = await this.readProductsFromFile() || [];

            if (limit) {
                return products.slice(0, limit);
            } else {
                return products;
            }
        } catch (error) {
            console.error("Error getting products: ", error.message);
            return null;
        }
    }

    async updateProduct(id, data) {
        let productIndex = this.productArray.findIndex(prod => prod.id === id);

        if (productIndex !== -1) {
            this.productArray[productIndex] = { ...this.productArray[productIndex], ...data, id };
            await this.writeProductsToFile(); 
            console.log("Product updated successfully")
            return { success: true };
        } else {
            console.error("Product not found");
            return { success: false };
        }
    }

    async deleteProductByID(id) {
        const productIndex = this.productArray.findIndex(prod => prod.id === id);

        if (productIndex !== -1) {
            this.productArray.splice(productIndex, 1);
            await this.writeProductsToFile(); 
            console.log(`Product with ID ${id} deleted successfully.`);

            return { success: true };
        } else {
            console.log("Product not found.");
            return { success: false };
        }
    }

    async getProductByID(id) {
        try {
            const products = await this.readProductsFromFile() || [];
            const foundProduct = products.find(prod => prod.id === id);

            if (foundProduct) {
                console.log(`The product with ID ${id} is present object :(${foundProduct}), name: ${foundProduct.title}`);
                return foundProduct;
            } else {
                console.log("Product not found");
                return null;
            }
        } catch (error) {
            console.error('Error reading products file:', error.message);
            return null;
        }
    }
}

const instance = new ProductManager('./productos.json');

module.exports = { instance, ProductManager };
