import { generateRandomDigits } from "./helpers.js";
import Player from "./player.js";
import Room from "./room_handler.js";

class RoomsHandler {
    constructor() {
        this.Rooms = new Map();
    }

    // this method to create new room
    addRoom() {
        let room = new Room();
        let id = room.id;
        this.Rooms.set(id, room);
        return room;
    }

    // this method to add player to a new room
    addPlayerToRoom(nickname, ws) {
        const lastKey = [...this.Rooms.keys()].at(-1);
        const lastRoom = this.Rooms.get(lastKey);
        const player = new Player(nickname, ws);

        if (lastRoom && lastRoom.length < 4 && !lastRoom.inGame) {
            lastRoom.addPlayer(player);
        } else {
            this.addRoom().addPlayer(player);
        }
    }

    // this method to remove player from a room
    removePlayer(ws) {
        for (const [roomId, room] of this.Rooms) {
            if (!room.removePlayer(ws)) continue;
            
            if (room.length === 0) {
                this.Rooms.delete(roomId);
            }
            break;
        }
    }

    // this methond to broadcast a message to chat
    broadcastMessage(message, ws) {
        for (let [_, room] of this.Rooms) {
            for (let player of room.players) {
                if (player.ws === ws) {
                    room.broadcast({
                        type: "chat_message",
                        message: `${player.nickname} : ${message}`
                    });
                }
            }
        }
    }
}

export default RoomsHandler;