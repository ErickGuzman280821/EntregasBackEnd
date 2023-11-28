const express = require('express');
const router = express.Router();
const productManager = require('../manager/Productmanager.js');
const { route } = require('./carrito.router');
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

async function getProductByID(req, res){
    const prodID = req.params.pid;

    try {
        const product = await productManager.instance.getProductByID(prodID);
        if ( product ){
            res.send(product);
        }else {
            res.send('<h1>Producto no encontrado</h1>');
        }
    }   catch (error){
        console.error('Error no se obtuvo el producto por ID', error.message);
        res.status(400).send(`Internal server Error ${error}`);
    }
}

async function getProductsByLimit(req, res){
    const limit = req.params.limit;

    try {
        const products = await productManager.instance.getProductsByLimit(limit);
        res.send(products);
    }   catch ( error ){
        console.error('Error no se obtuvo el limite del producto', error.message);
        res.status(400).send(`Internal server Error ${error}`);
    }
}

async function addProduct(req, res){
    const data = req.body;

    try {
        const product = await productManager.instance.addProduct(data);
        if ( product.success ){
            res.send('Producto añadido exitosamente');
        }else{
            res.send('No pudo ser añadido el producto');
        }
    }   catch (error){
        console.log('Error no se añadio el producto', error.message);
        res.status(400).send(`Internal server Error ${error}`);
    }
}

async function updateProductByID(req, send){
    const id = req.params.pid;
    const data = req.body;

    try {
        const update = await productManager.instance.updateProduct(id, data);
        if ( update.success ){
            res.send(`El item con ${id} fue actualizado exitosamente, ${data}`);
        }else {
            res.status(404).send(`El producto con ${id} no fue encontrado`);
        }
    }   catch ( error ){
        console.error('Error no se actualizo el producto', error.message);
        res.status(400).send(`Internal server Error ${error}`);
    }
}

async function deleteProductById(req, res){
    const id = req.params.pid;
    
    try {
        const deleteProd = await productManager.instance.deleteProductByID(id);

        if ( deleteProd.success ){
            res.send(`El item con ID ${id} fue removido con exito`);
        }else {
            res.status(404).send(`El producto con ID ${id} no fue encontrado`);
        }
    }   catch ( error ){
        console.log('Error no se elimino el producto', error.message);
        res.status(400).send(`Internal server Error ${error}`);
    }
}

router.get('/api/products', getProductByID);
router.get('/api/products/:pid', getProductsByLimit);
router.post('/api/products/', addProduct);
router.post('/api/products/:pid', updateProductByID);
router.delete('/api/products/:pid', deleteProductById);



module.exports = router;