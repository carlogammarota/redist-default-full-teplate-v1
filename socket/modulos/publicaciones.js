// /socket/modulos/publicaciones.js

const { client } = require('../../Redis'); // Asegúrate de tener configurado Redis

async function inicializarPublicaciones() {
    const publicaciones = [
        { id: '1', nombre: 'Tomate Perita 3kg', precio: 500, likes: 0 },
        { id: '2', nombre: 'Cebolla Blanca 1kg', precio: 300, likes: 0 },
    ];

    publicaciones.forEach(async (pub) => {
        await client.hSet(`publicacion:${pub.id}`, pub);
    });
}

async function obtenerPublicaciones() {
    const keys = await client.keys('publicacion:*');
    const publicaciones = [];
    
    for (const key of keys) {
        const publicacion = await client.hGetAll(key);
        publicaciones.push(publicacion);
    }
    
    return publicaciones;
}

async function toggleLike(publicacionId, usuarioId) {
    const likeKey = `publicacion:${publicacionId}:likes`;
    const key = `publicacion:${publicacionId}`;

    // Verificar si el usuario ya ha dado "Me gusta"
    const yaDioLike = await client.sIsMember(likeKey, usuarioId);

    let nuevosLikes;
    if (yaDioLike) {
        // Eliminar "Me gusta"
        await client.sRem(likeKey, usuarioId);
        nuevosLikes = await client.hIncrBy(key, 'likes', -1);
        return { nuevosLikes, dioLike: false }; // Devolvemos que ya no dio "Me gusta"
    } else {
        // Agregar "Me gusta"
        await client.sAdd(likeKey, usuarioId);
        nuevosLikes = await client.hIncrBy(key, 'likes', 1);
        return { nuevosLikes, dioLike: true }; // Devolvemos que ahora dio "Me gusta"
    }
}

module.exports = { inicializarPublicaciones, obtenerPublicaciones, toggleLike };