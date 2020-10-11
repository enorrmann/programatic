const fs = require('fs');
const http = require('http');
const WebSocket = require('ws');
const player = require('./player.js');

const server = http.createServer(function(req, res) {
    //console.log(req.url);
    var fileName = req.url.substr(1);
    fs.readFile(fileName, 'utf8', function(err, data) {
        if (err) {
            return console.log(err);
        }
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write(data);
        res.end();
    });

});
const wss = new WebSocket.Server({ server });

wss.on('connection', function connection(ws) {
    ws.on('message', function incoming(message) {
        //console.log('received: %s', message);
        ws.send('gracias por decir ' + message);
        player.generate(message);
    });

    ws.send('something');
});

server.listen(8080);