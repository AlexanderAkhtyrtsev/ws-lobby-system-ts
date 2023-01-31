import {WebSocket} from "ws";
import {createPackage, PackageTypes} from "./WebsocketPackage";

export enum LobbyEvents {
    ParticipantConnected= 'participant.connected'
}

export default class Lobby {
    static id = 0;

    private participants: WebSocket[] = [];
    public readonly id = ++Lobby.id;
    constructor(public readonly limit = 2) {}

    add(participant: WebSocket) {
        if (this.isFull)
            return;

        this.participants.push(participant);
    }

    remove(participant: WebSocket) {
        this.participants = this.participants.filter( p => p !== participant )
    }

    get isFull() {
        return this.limit === this.participants.length;
    }

    public participantList(exceptions: WebSocket[] = []) {
        return this.participants.filter( p => !exceptions.includes(p) )
    }

    notify(message: string, exceptions: WebSocket[] = []) {
        this.participantList(exceptions).forEach(p => {
            p.send(JSON.stringify(
                createPackage(PackageTypes.Notification, message)
            ))
        })
    }
}