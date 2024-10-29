// /socket/index.js

const { Server } = require('socket.io');
const { manejarRangos } = require('./modulos/rango');
const { inicializarPublicaciones, obtenerPublicaciones, toggleLike } = require('./modulos/publicaciones');

let io;

function initSocket(server) {
    io = new Server(server);
    
    io.on('connection', (socket) => {
        console.log(`Cliente conectado: ${socket.id}`);

        
        manejarRangos(socket, io);
    });

    return io;
}

module.exports = { initSocket, io };
