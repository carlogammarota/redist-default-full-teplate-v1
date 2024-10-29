const { Server } = require('socket.io');
const { manejarRangos } = require('./modulos/rango');
const { inicializarPublicaciones, toggleLike } = require('./modulos/publicaciones');

let io;

function initSocket(server) {
    io = new Server(server);
    
    io.on('connection', (socket) => {
        console.log(`Cliente conectado: ${socket.id}`);
        
        inicializarPublicaciones(socket); // Enviar las publicaciones al nuevo cliente

        // Manejar el evento de toggleLike
        socket.on('toggleLike', (publicacionId) => {
            toggleLike(io, socket, publicacionId); // Pasar io y socket correctamente
        });
        
        manejarRangos(socket, io);
    });

    return io;
}

module.exports = { initSocket, io };
