// userService.js
const { client } = require("../../Redis"); // Asegúrate de que la ruta sea correcta

// Función para crear un nuevo usuario
async function createUser(userData) {
  await client.set(`user:${userData.googleId}`, JSON.stringify(userData));
  return userData;
}

// Función para buscar un usuario por Google ID o email
async function findUserByGoogleIdOrEmail(googleId, email) {
  const user = await client.get(`user:${googleId}`);
  if (user) {
    return JSON.parse(user);
  }

  const allUsers = await client.keys("user:*");
  for (const key of allUsers) {
    const userData = JSON.parse(await client.get(key));
    if (userData.email === email) {
      return userData;
    }
  }

  return null; // No se encontró el usuario
}

// Función para obtener un usuario por ID
async function getUserById(id) {
  const user = await client.get(`user:${id}`);
  return JSON.parse(user);
}

module.exports = { createUser, findUserByGoogleIdOrEmail, getUserById };
