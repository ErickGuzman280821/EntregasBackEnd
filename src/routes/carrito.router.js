const express = require('express');
const router = express.Router();
const cartManager = require('../manager/Cartmanager.js');
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

async function createCart(req, res) {
    const data = req.body;
    const cart = await cartManager.instance.createCart(data);
    
    try {
        if( cart ) {
            res.send(cart);
        }else {
            res.send('No se pudo crear el carro');
        }
    }   catch (error) {
        console.error('Error al crear carro', error.message);
        res.status(500).send(`Internal server error ${error}`);
    }
}


async function getCartInfo(req, res){
    const id = req.params.cid;
    const cart = await cartManager.instance.getCart(id);

    try {
        if( cart ){
            res.send(cart);
        }else{
            res.send('No se encontro el carrito');
        }
    }   catch (error) {
        console.error('Error retrieving cart:', error.message);
        res.status(400).send(`Internal server error ${error}`);
    }
}


async function addToCart(req, res) {
    const cartID = req.params.cid;
    const data = req.params.pid;
    const cart = await cartManager.instance.addToCart(cartID, data);

    try {
        if ( cart ) {
            res.send(cart);
        }else{
            res.send('No se pudo añadir al carrito');
        }
    }   catch ( error ){
        console.error('Error creating cart', error.message);
        res.status(400).send(`Internal server error ${error}`);
    }
}

router.post('/api/carts', createCart);
router.put('/api/carts', getCartInfo);
router.post('/api/carts/:cid/product/:pid', addToCart);

module.exports = router;