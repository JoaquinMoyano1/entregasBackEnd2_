const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const exphbs  = require('express-handlebars'); 

const app = express();
const server = http.createServer(app);
const io = socketIo(server);


// Configurar Handlebars
app.engine('handlebars', exphbs({ defaultLayout: 'main' })); 
app.set('view engine', 'handlebars');

// vistas
app.get('/', (req, res) => {
  res.render('home', { products: getAllProducts() });
});

// Configurar ruta para la vista en tiempo real
app.get('/realtimeproducts', (req, res) => {
  res.render('realTimeProducts', { products: getAllProducts() });
});

// Configurar WebSocket 
io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('updateProducts', () => {
    io.emit('productsUpdated', getAllProducts());
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Función de ejemplo para obtener todos los productos
function getAllProducts() {
  return ['Producto 1', 'Producto 2', 'Producto 3'];
}

// Iniciar
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Servidor en ejecución en http://localhost:${PORT}`);
});
