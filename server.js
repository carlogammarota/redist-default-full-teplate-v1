// server.js

const express = require('express');
const http = require('http');
const { initSocket } = require('./socket/index');

const app = express();
const server = http.createServer(app);
const io = initSocket(server);

// Middleware para servir archivos estáticos
app.use(express.static('public'));

// Inicializar el servidor en el puerto deseado
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Servidor en funcionamiento en http://localhost:${PORT}`);
});
