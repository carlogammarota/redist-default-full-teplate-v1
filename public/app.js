const socket = io(); // Aquí se establece la conexión al servidor

const app = Vue.createApp({
    data() {
        return {
            rangos: [],
            publicaciones: [],
            miId: null // Asegúrate de declarar miId en data()
        };
    },
    mounted() {
        // Escuchar el ID del cliente
        socket.on('miId', (id) => {
            this.miId = id; // Guardar el ID del cliente
        });

        // Escuchar las publicaciones
        socket.on('publicaciones', (data) => {
            // Actualiza publicaciones y configura dioLike
            this.publicaciones = data.map(pub => ({
                ...pub,
                dioLike: pub.usuariosQueDieronLike // Inicializa dioLike
            }));
        });

        // Escuchar actualizaciones de likes
        socket.on('likeActualizado', ({ id, likes, dioLike }) => {
            const publicacion = this.publicaciones.find(p => p.id === id);
            if (publicacion) {
                publicacion.likes = likes;
                publicacion.dioLike = dioLike; // Actualiza el estado de "Me gusta" para este cliente
            }
        });

        // Escuchar todos los rangos al conectarse
        socket.on('todosLosRangos', (rangos) => {
            this.rangos = rangos.sort((a, b) => a.id.localeCompare(b.id)); // Ordenar por ID
        });

        // Escuchar nuevos rangos
        socket.on('nuevoRango', (rango) => {
            // Solo agregar si no existe
            if (!this.rangos.find(r => r.id === rango.id)) {
                this.rangos.push(rango);
                this.rangos.sort((a, b) => a.id.localeCompare(b.id)); // Mantener el orden
            }
        });

        // Escuchar actualizaciones de rango
        socket.on('rangoActualizado', (rangoActualizado) => {
            const index = this.rangos.findIndex(rango => rango.id === rangoActualizado.id);
            if (index !== -1) {
                this.rangos[index].valor = rangoActualizado.valor;
            }
        });

        // Escuchar eliminación de rango
        socket.on('rangoEliminado', (rangoId) => {
            this.rangos = this.rangos.filter(rango => rango.id !== rangoId);
        });
    },
    methods: {
        actualizarRango(rango) {
            // Solo permitir actualizar el rango si es del cliente actual
            if (rango.id === this.miId) { // Cambiar a this.miId
                socket.emit('actualizarRango', rango);
            }
        },
        toggleLike(publicacion) {
            // Emitir el evento para alternar "Me gusta"
            socket.emit('toggleLike', publicacion.id);
        }
    },
    // Un watch que escuche los cambios en las publicaciones y ordene por likes
    watch: {
        publicaciones: {
            handler() {
                console.log('Publicaciones actualizadas');
                this.publicaciones.sort((a, b) => b.likes - a.likes);
            },
            deep: true
        }
    }
});

app.mount('#app');
