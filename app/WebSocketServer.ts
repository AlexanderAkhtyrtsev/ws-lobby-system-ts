import * as WebSocket from 'ws';
import {server, app} from "./HttpServer";


app.get('/ws', () => {
    const wss = new WebSocket.Server({ server });

    wss.on('connection', (ws: WebSocket) => {
        ws.on('message', (message: string) => {
            console.log('received: %s', message)

            wss.clients.forEach(client => {
                if (client !== ws)
                    client.send(message)
            })
        });
    })
})


