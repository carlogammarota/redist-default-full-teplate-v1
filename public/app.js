const socket = io();

const app = Vue.createApp({
    data() {
        return {
            rangos: [],
            miId: null // Para almacenar el ID del cliente
        };
    },
    mounted() {
        // Escuchar el ID del cliente
        socket.on('miId', (id) => {
            this.miId = id; // Guardar el ID del cliente
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
            if (rango.id === this.miId) {
                socket.emit('actualizarRango', rango);
            }
        }
    }
});

app.mount('#app');
