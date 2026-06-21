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
    }

    addPlayerToRoom(nickname, ws) {
        const existingRoom = this.getRoomBySocket(ws);
        if (existingRoom) {
            const existingPlayer = existingRoom.players.find(player => player.ws === ws);
            if (existingPlayer) {
                existingPlayer.nickname = nickname;
            }
            existingRoom.broadcast({
                type: "room_update",
                roomId: existingRoom.id,
                playersCount: existingRoom.players.length,
                secondsLeft: existingRoom.timer ? existingRoom.secondsLeft : null,
                text: existingRoom.timer ? existingRoom.getLobbyText() : "Waiting for more players",
            });
            return;
        }

        const lastKey = [...this.Rooms.keys()].at(-1);
        const lastRoom = this.Rooms.get(lastKey);
        const player = new Player(nickname, ws);

        if (lastRoom && lastRoom.length < 4 && !lastRoom.inGame) {
            lastRoom.addPlayer(player);
        } else {
            this.addRoom();
            this.Rooms.get([...this.Rooms.keys()].at(-1)).addPlayer(player);
        }
    }

    getRoomBySocket(ws) {
        for (const [_, room] of this.Rooms) {
            if (room.players.some(player => player.ws === ws)) {
                return room;
            }
        }
        return null;
    }

    handlePlayerDeath(ws) {
        for (const [roomId, room] of this.Rooms) {
            const player = room.players.find(p => p.ws === ws);
            if (!player) continue;

            room.handlePlayerDeath(ws);

            if (room.length === 0 || (room.inGame && room.players.length <= 1)) {
                this.Rooms.delete(roomId);
            }
            break;
        }
    }

    removePlayer(ws) {
        for (const [roomId, room] of this.Rooms) {
            if (!room.removePlayer(ws)) continue;

            if (room.length === 0 || (room.inGame && room.players.length <= 1)) {
                this.Rooms.delete(roomId);
            }
            break;
        }
    }

    broadcastMessage(message, ws) {
        for (let [_, room] of this.Rooms) {
            for (let player of room.players) {
                if (player.ws === ws) {
                    room.broadcastMessage(`${player.nickname}: ${message}`);
                }
            }
        }
    }

    broadcastGameMessage(ws, message) {
        for (let [_, room] of this.Rooms) {
            const sender = room.players.find(player => player.ws === ws);
            if (sender) {
                room.broadcast({
                    ...message, payload: { ...message.payload, id: sender.id, },
                });
                return;
            }
        }
    }
}

export default RoomsHandler;
