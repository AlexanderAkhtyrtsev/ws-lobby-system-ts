import * as WebSocket from 'ws';

const wss = new WebSocket.Server({ port: +(process.env.WS_PORT || 80) });

wss.on('connection', (ws: WebSocket, request) => {
    ws.send('Hello, ' + request.socket.remoteAddress)

    //connection is up, let's add a simple  event
    ws.on('message', (message: string) => {
        console.log('received: %s', message)

        wss.clients.forEach(client => {
            if (client !== ws)
                client.send(message)
        })
    });
});

