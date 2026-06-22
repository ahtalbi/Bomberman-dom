import { generateRandomDigits } from "./helpers.js";
import Player from "./player.js";
import Room from "./room_handler.js";

class RoomsHandler {
    constructor() {
        this.Rooms = new Map();
    }

    addRoom() {
        let room = new Room();
        let id = room.id;
        this.Rooms.set(id, room);
        return room;
    }

    addPlayerToRoom(nickname, ws) {
        nickname = nickname.trim().toLowerCase();
        if (this.getRoomBySocket(ws)) return null;

        const lastKey = [...this.Rooms.keys()].at(-1);
        const lastRoom = this.Rooms.get(lastKey);

        if (lastRoom && lastRoom.length < 4 && !lastRoom.inGame) {
            if (lastRoom.players.some(p => p.nickname === nickname)) {
                return "Nickname already taken in this room";
            }
            lastRoom.addPlayer(new Player(nickname, ws));
        } else {
            this.addRoom().addPlayer(new Player(nickname, ws));
        }
        return null;
    }

    getRoomBySocket(ws) {
        for (const [_, room] of this.Rooms) {
            if (room.players.some(player => player.ws === ws)) {
                return room;
            }
        }
        return null;
    }

    removePlayer(ws) {
        for (const [roomId, room] of this.Rooms) {
            if (!room.removePlayer(ws)) continue;
            
            if (room.length === 0) {
                this.Rooms.delete(roomId);
            }
            break;
        }
    }

    broadcastMessage(message, ws) {
        for (let [_, room] of this.Rooms) {
            for (let player of room.players) {
                if (player.ws === ws) {
                    room.broadcastMessage(player.nickname, message);
                    return;
                }
            }
        }
    }

    broadcastGameMessage(ws, message) {
        for (let [_, room] of this.Rooms) {
            const sender = room.players.find(player => player.ws === ws);
            if (sender) {
                room.broadcast({
                    ...message,
                    payload: {
                        ...message.payload,
                        id: sender.id,
                    },
                });
                return;
            }
        }
    }

    handleMove(ws, payload) {
        const room = this.getRoomBySocket(ws);
        if (room) room.handleMove(ws, payload);
    }

    dropBomb(ws) {
        const room = this.getRoomBySocket(ws);
        if (room) room.dropBomb(ws);
    }
}

export default RoomsHandler;