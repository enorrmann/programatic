// Crea una nueva conexión.
const socket = new WebSocket('ws://192.168.0.15:8080');

// Abre la conexión
socket.addEventListener('open', function(event) {
    //socket.send('Hello Server!');
});

// Escucha por mensajes
socket.addEventListener('message', function(event) {
    //console.log('Message from server', event.data);
});

var sendMessage = function(mess) {
    socket.send(mess);
}