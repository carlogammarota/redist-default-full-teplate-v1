// Importa el cliente Redis
const { createClient } = require('redis');

// Configuración del cliente Redis
const client = createClient({
    password: 'UKWkePDPzdo1oAq7hBtdHCMAUuxmaI50',
    socket: {
        host: 'redis-16489.c336.samerica-east1-1.gce.redns.redis-cloud.com',
        port: 16489
    }
});

// Conectar a Redis
client.connect()
    .then(() => console.log("Conectado a Redis"))
    .catch(console.error);

// Función para Crear un registro (Create)
async function createData(key, value) {
    try {
        value.id = Math.floor(Math.random() * 1000000);
        await client.set(key, JSON.stringify(value));
        console.log(`Dato creado: ${key}`);
    } catch (err) {
        console.error("Error al crear dato:", err);
    }
}

// Función para Crear un dato nuevo en el array de 'publicaciones'
async function addDataToArray(key, newValue) {
    try {
        const existingData = await client.get(key);
        let dataArray = existingData ? JSON.parse(existingData) : [];

        // Asignar ID único al nuevo dato
        newValue.id = Math.floor(Math.random() * 1000000);
        
        dataArray.push(newValue);
        await client.set(key, JSON.stringify(dataArray));
        console.log(`Nuevo dato añadido a ${key}`);
    } catch (err) {
        console.error("Error al añadir dato:", err);
    }
}

// Función para Leer un registro (Read)
async function readData(key) {
    try {
        const data = await client.get(key);
        return JSON.parse(data);
    } catch (err) {
        console.error("Error al leer dato:", err);
    }
}

// Función para Actualizar un registro (Update)
async function updateData(key, newValue) {
    try {
        await client.set(key, JSON.stringify(newValue));
        console.log(`Dato actualizado: ${key}`);
    } catch (err) {
        console.error("Error al actualizar dato:", err);
    }
}

// Función para Eliminar un registro (Delete)
async function deleteData(key) {
    try {
        await client.del(key);
        console.log(`Dato eliminado: ${key}`);
    } catch (err) {
        console.error("Error al eliminar dato:", err);
    }
}

// Función para guardar un usuario en Redis
async function saveUser(username, userData) {
    try {
        await client.set(`user:${username}`, JSON.stringify(userData));
        console.log(`Usuario guardado: ${username}`);
    } catch (err) {
        console.error("Error al guardar usuario:", err);
    }
}

module.exports = { 
    client, 
    createData, 
    readData, 
    updateData, 
    deleteData, 
    addDataToArray, 
    saveUser 
};
