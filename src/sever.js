const express = require('express');
const productoRouter = require('./routes/products.router');
const app = express();
const PORT = 8080;

app.use(express.json());

app.use('/api/productos', productoRouter);

app.get('/productos', (req, res) => {
    res.send('Producto');
})
app.get('/api/cart', (req, res) => {
    res.send('Carrito');
})

app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`)
})

module.exports = app;
