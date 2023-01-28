import * as WebSocket from 'ws';
import {server, app} from "./HttpServer";
import Lobby from "./Lobby";


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

        console.log(`${request.socket.remoteAddress} joined lobby #${lobby.id}`)

        ws.on('message', (message: string) => {
            console.log(request.socket.remoteAddress + ' said: ' + message)
            if (lobby) {
                lobby.participantList([ws]).forEach(p => p.send(message.toString()))
            }
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


