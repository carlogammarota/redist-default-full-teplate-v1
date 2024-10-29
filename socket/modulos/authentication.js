// authentication.js
const bcrypt = require('bcrypt'); // Para encriptar contraseñas
const jwt = require('jsonwebtoken'); // Para crear tokens JWT

const SECRET_KEY = 'tu_secreto_aqui'; // Cambia esto a una clave secreta más segura en producción

// Almacenamiento de usuarios en memoria (cambiar a una base de datos en producción)
const users = {};

// Registro de usuarios
const register = async (username, password) => {
    if (users[username]) {
        throw new Error('El usuario ya existe');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    users[username] = { password: hashedPassword };
    console.log('Usuarios:', users);
    return { message: 'Usuario registrado exitosamente' };
};

// Inicio de sesión
const login = async (username, password) => {
    const user = users[username];
    if (!user || !(await bcrypt.compare(password, user.password))) {
        throw new Error('Credenciales inválidas');
    }
    const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '1h' });
    console.log('Usuarios:', users);
    return { token };
};

// Exportar funciones
module.exports = {
    register,
    login,
};
