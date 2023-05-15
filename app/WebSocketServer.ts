import * as WebSocket from 'ws';
import {app, server} from "./HttpServer";
import Lobby, {LobbyEvents} from "./Lobby";
import {createPackage, PackageTypes} from "./WebsocketPackage";

app.get('/ws/:id', ( req, res ) => {
    const { id } = req.params;

    const wss = new WebSocket.Server({ server });

    wss.on('connection', (ws: WebSocket, request) => {
        const lobby = Lobby.findById(id);

        if (lobby === undefined) {
            ws.close(404);
            return;
        }

        // Join lobby
        lobby.add(ws);

        lobby.notify(LobbyEvents.ParticipantConnected, [ws]);

        console.log(`${request.socket.remoteAddress} joined lobby #${lobby.id}`);

        ws.on('message', (message: string) => {
            console.log(request.socket.remoteAddress + ' said: ' + message)

            lobby.participantList().forEach(p => {
                p.send(JSON.stringify(createPackage(
                    PackageTypes.Message,
                    message.toString()
                )))
            })
        });

        ws.on('close', () => {
            lobby.remove(ws);

            if (!lobby.participantList().length) {
                lobby.destroy();
                console.log('Lobby #' + lobby.id + ' closed.')
            }

            console.log('disconnected ' + request.socket.remoteAddress);
        });
    })
});
