import * as WebSocket from 'ws';

const wss = new WebSocket.Server({ port: +(process.env.WS_PORT || 80) });

wss.on('connection', (ws: WebSocket, request) => {
    ws.send('Hello, ' + request.socket.remoteAddress)

    //connection is up, let's add a simple  event
    ws.on('message', (message: string) => {

        //log the received message and send it back to the client
        console.log('received: %s', message);
        ws.send(`Hello, you sent -> ${message}`);
    });

    //send immediately a feedback to the incoming connection
    ws.send('Hi there, I am a WebSocket server');
});
