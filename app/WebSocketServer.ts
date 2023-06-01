import * as WebSocket from 'ws';
import {app, server} from "./HttpServer";
import Lobby, {LobbyEvents} from "./Lobby";
import {createPackage, PackageTypes} from "./WebsocketPackage";

app.get('/ws', ( req, res ) => {
    const wss = new WebSocket.Server({ server });

    wss.on('connection', (ws: WebSocket, request) => {
        const id = (request?.url || '').match(/\?id=(\d+)/) ?. [1];

        if (!id) {
            ws.send(JSON.stringify(createPackage(
                PackageTypes.Message,
                'No lobby id provided'
            )))
            ws.close();
            return;
        }

        const lobby = Lobby.findById(id);

        if (lobby === undefined) {
            ws.terminate();
            console.log('Lobby #' + id + ' not found');
            return;
        }

        // Join lobby
        lobby.add(ws);

        lobby.notify(LobbyEvents.ParticipantConnected, [ws]);

        console.log(`${request.socket.remoteAddress} joined lobby #${lobby.id}`);

        ws.on('message', (message: string, ...args) => {
            console.log(request.socket.remoteAddress + ' said: ' + message)

            lobby.participantList().forEach(p => {
                p.send(JSON.stringify(createPackage(
                    PackageTypes.Message,
                    message.toString()
                )))
            })

            console.log(args)
        });

        ws.on('close', () => {
            lobby.remove(ws);

            if (!lobby.participantList().length) {
                lobby.destroy();
                console.log('Lobby #' + lobby.id + ' closed.')
            }

            console.log('disconnected ' + request.socket.remoteAddress);
        });
    });

    console.log('Fin')
});
