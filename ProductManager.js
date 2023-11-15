const fs = require('fs');

class ProductManager {

      constructor(path) {
      this.path = path;

  }

  async siguienteId() {

      try {

        const productos = await this.getProductos();
        const maximaId = productos.reduce((max, product) => (product.id > max ? product.id : max), 0);
        return maximaId + 1;

    } catch (error) {

        throw new Error('Error obteniendo siguiente ID');

    }
  }

  async addProduct(product) {
    try {
      const products = await this.getProducts();
      const nextId = await this.getNextId();
      const newProduct = { ...product, id: nextId };
      products.push(newProduct);
      await this.saveProducts(products);
      return newProduct;
    } catch (error) {
      throw new Error('Error adding product');
    }
  }

  async getProducts() {
    try {
      const fileData = await fs.promises.readFile(this.path, 'utf-8');
      return JSON.parse(fileData) || [];
    } catch (error) {
      return [];
    }
  }

  async getProductById(id) {
    try {
      const products = await this.getProducts();
      return products.find((product) => product.id === id);
    } catch (error) {
      throw new Error('Error getting product by ID');
    }
  }

  async updateProduct(id, updatedProduct) {
    try {
      const products = await this.getProducts();
      const index = products.findIndex((product) => product.id === id);

      if (index !== -1) {
        // Preserve the ID
        updatedProduct.id = id;
        products[index] = updatedProduct;
        await this.saveProducts(products);
        return updatedProduct;
      } else {
        throw new Error('Product not found');
      }
    } catch (error) {
      throw new Error('Error updating product');
    }
  }

  async deleteProduct(id) {
    try {
      const products = await this.getProducts();
      const updatedProducts = products.filter((product) => product.id !== id);
      await this.saveProducts(updatedProducts);
    } catch (error) {
      throw new Error('Error deleting product');
    }
  }

  async saveProducts(products) {
    try {
      await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2), 'utf-8');
    } catch (error) {
      throw new Error('Error saving products');
    }
  }
}

module.exports = ProductManager;
