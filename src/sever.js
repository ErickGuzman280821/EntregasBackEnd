const express = require("express");
const handlebars = require("express-handlebars");
const http = require('http');
const utils = require('./utils.js');
const { Server } = require('socket.io');

const productsRouter = require('./routes/products.router.js');
const cartsRouter = require('./routes/carrito.router.js');


const app = express();
const server = http.createServer(app);
const io = new Server(server);
const port = 8080;


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine('handlebars', handlebars.engine());
app.set('views', utils);
app.set('view engine', 'handlebars');
app.use(express.static(utils+'/public'))


app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);


io.on('connection', async (socket) => {
    console.log('Usuario conectado');
    
    io.emit('updateProducts', await productManager.instance.getProducts());
    
    socket.on('disconnect', () => {
        console.log('Usuario desconectado');
    });
});

app.use((req, res, next) => {
    req.io = io;
    next();
});

app.get('/realTimeProducts', (req, res) => {
    res.render('realTimeProducts');
});


server.listen(port, () => {
    console.log(`Running in http://localhost:${port}`)
   });