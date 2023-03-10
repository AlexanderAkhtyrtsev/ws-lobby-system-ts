import * as WebSocket from 'ws';
import {app, server} from "./HttpServer";
import Lobby, {LobbyEvents} from "./Lobby";
import {createPackage, PackageTypes} from "./WebsocketPackage";


const lobbies: Set<Lobby> = new Set<Lobby>();

function findLobby() {
    return [...Array.from(lobbies)].find(l => !l.isFull);
}


app.get('/ws', () => {
    const wss = new WebSocket.Server({ server });

    wss.on('connection', (ws: WebSocket, request) => {
        let lobby = findLobby();

        if (lobby === undefined) {
            lobby = new Lobby()
            lobbies.add( lobby )
            console.log(`Lobby #${lobby.id} created`)
        }

        // Join lobby
        lobby.add(ws);

        lobby.notify(LobbyEvents.ParticipantConnected, [ws]);

        console.log(`${request.socket.remoteAddress} joined lobby #${lobby.id}`);

        ws.on('message', (message: string) => {
            console.log(request.socket.remoteAddress + ' said: ' + message)

            lobby &&
            lobby.participantList().forEach(p => {
                p.send(JSON.stringify(createPackage(
                    PackageTypes.Message,
                    message.toString()
                )))
            })

        });

        ws.on('close', () => {
            if (lobby) {
                lobby.remove(ws);

                if (!lobby.participantList().length) {
                    lobbies.delete(lobby);
                    console.log('Lobby #' + lobby.id + ' closed.')
                }
            }

            console.log('disconnected ' + request.socket.remoteAddress);
        });
    })
})


