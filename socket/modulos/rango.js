// /socket/modulos/rango.js

let clientes = {};
let todosLosRangos = [];

function manejarRangos(socket, io) {
    // Emitir todos los rangos al nuevo cliente
    socket.emit('todosLosRangos', todosLosRangos);

    // Generar un nuevo rango de entrada
    const nuevoRango = { id: socket.id, valor: Math.floor(Math.random() * 100) + 1 };
    clientes[socket.id] = nuevoRango;
    todosLosRangos.push(nuevoRango);

    // Enviar al nuevo cliente su ID y notificar a todos sobre el nuevo rango
    socket.emit('miId', socket.id);
    io.emit('nuevoRango', nuevoRango);

    // Manejar la actualización del rango
    socket.on('actualizarRango', (rango) => {
        io.emit('rangoActualizado', rango);
        const r = todosLosRangos.find(r => r.id === rango.id);
        if (r) r.valor = rango.valor;
    });

    // Manejar la desconexión del cliente
    socket.on('disconnect', () => {
        console.log(`Cliente desconectado: ${socket.id}`);
        io.emit('rangoEliminado', socket.id);
        
        todosLosRangos = todosLosRangos.filter(r => r.id !== socket.id);
        delete clientes[socket.id];
    });
}

module.exports = { manejarRangos };
