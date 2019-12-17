const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const axios = require('axios');
const port = process.env.PORT || 4001;
const index = require('./routes/index');
const app = express();
app.use(index);
const server = http.createServer(app);
const io = socketIo(server); // < Interesting!

let interval;

io.on('connection', socket => {
    console.log('New client connected');
    interval = setInterval(() => getApiAndEmit(socket), 10000);
    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
    socket.on('chat message', function(msg){
        console.log(msg);
        io.emit('chat message', msg);
    });
});

server.listen(port, () => console.log(`Listening on port ${port}`));

const getApiAndEmit = async socket => {
    socket.emit('FromServerInit', 'Conectado');
};