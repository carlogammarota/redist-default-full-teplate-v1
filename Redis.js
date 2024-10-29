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
        //id Math.floor(Math.random() * 1000000);
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
        // Leer el array actual desde Redis
        const existingData = await client.get(key);
        let dataArray = existingData ? JSON.parse(existingData) : [];

        dataArray.forEach(element => {
            element.id = Math.floor(Math.random() * 1000000);
        });

        // Agregar el nuevo elemento al array
        dataArray.push(newValue);

        // Guardar el array actualizado en Redis
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

// // Ejemplo de uso
// (async () => {
//     // Crear un dato
//     await createData('user:1001', { nombre: "Juan", edad: 30 });

//     // Leer el dato
//     const user = await readData('user:1001');
//     console.log("Usuario leído:", user);

//     // Actualizar el dato
//     await updateData('user:1001', { nombre: "Juan", edad: 31 });

//     // Leer el dato actualizado
//     const updatedUser = await readData('user:1001');
//     console.log("Usuario actualizado:", updatedUser);

//     // Eliminar el dato
//     await deleteData('user:1001');
// })();

// Exportar el cliente para uso en otros módulos si es necesario
module.exports = { client, createData, readData, updateData, deleteData, addDataToArray };
