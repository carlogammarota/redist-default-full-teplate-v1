let publicaciones = [
    { id: 1, titulo: "Oferta 1", precio: 100, imagen: "https://picsum.photos/200/300", likes: 0, usuariosQueDieronLike: [] },
    { id: 2, titulo: "Oferta 2", precio: 200, imagen: "https://picsum.photos/200/301", likes: 0, usuariosQueDieronLike: [] },
    { id: 3, titulo: "Oferta 3", precio: 300, imagen: "https://picsum.photos/200/302", likes: 0, usuariosQueDieronLike: [] }
];

function inicializarPublicaciones(socket) {
    // Emitir todas las publicaciones al cliente que se conecta
    socket.emit('publicaciones', publicaciones);
}

function toggleLike(io, socket, publicacionId) {
    const publicacion = publicaciones.find(pub => pub.id === publicacionId);
    if (publicacion) {
        const usuarioId = socket.id;

        if (publicacion.usuariosQueDieronLike.includes(usuarioId)) {
            // Quitar like
            publicacion.likes--;
            publicacion.usuariosQueDieronLike = publicacion.usuariosQueDieronLike.filter(id => id !== usuarioId);
        } else {
            // Agregar like
            publicacion.likes++;
            publicacion.usuariosQueDieronLike.push(usuarioId);
        }

        // Emitir la actualización a todos los clientes
        io.emit('likeActualizado', { id: publicacion.id, likes: publicacion.likes, dioLike: publicacion.usuariosQueDieronLike });
    }
}

module.exports = { inicializarPublicaciones, toggleLike };
