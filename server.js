const express = require('express');
const http = require('http');
const { initSocket } = require('./socket/index');
const { register, login } = require('./socket/modulos/authentication'); // Importar el módulo

const app = express();
const server = http.createServer(app);
const io = initSocket(server);

// Middleware para servir archivos estáticos
app.use(express.static('public'));
app.use(express.json()); // Para parsear JSON en las solicitudes

// Manejar conexiones de Socket.io
io.on('connection', (socket) => {
    console.log('Usuario conectado:', socket.id);

    // Registro de usuario
    socket.on('register', async ({ username, password }) => {
        try {
            console.log('Registrer:', username)
            const result = await register(username, password);
            socket.emit('registerSuccess', result);
        } catch (error) {
            socket.emit('registerError', { error: error.message });
        }
    });

    // Inicio de sesión
    socket.on('login', async ({ username, password }) => {
        socket.emit('loginSuccess', "result");
        try {
            const result = await login(username, password);
            socket.emit('loginSuccess', {
                token: result.token,
                username,
            });
            return result;
        } catch (error) {
            socket.emit('loginError', { error: error.message });
        }
    });

    // Manejar desconexión
    socket.on('disconnect', () => {
        console.log('Usuario desconectado:', socket.id);
    });
});

// Inicializar el servidor en el puerto deseado
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Servidor en funcionamiento en http://localhost:${PORT}`);
});
