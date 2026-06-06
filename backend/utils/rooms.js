import { generateRandomDigits } from "./helpers.js";
import Player from "./player.js";

class RoomsHandler {
    constructor() {
        this.Rooms = new Map();
    }

    addRoom() {
        let room = new Room();
        let id = room.getIdRoom();
        this.Rooms.set(id, room);
    }

    addPlayerToRoom(nickname, ws) {
        const lastKey = [...this.Rooms.keys()].at(-1);
        const lastRoom = this.Rooms.get(lastKey);
        const player = new Player(nickname, ws);

        if (lastRoom && lastRoom.length < 4) {
            lastRoom.addPlayer(player);
        } else {
            this.addRoom();
            this.Rooms.get([...this.Rooms.keys()].at(-1)).addPlayer(player);
        }
    }
}

class Room {
    constructor() {
        this.id = generateRandomDigits();
        this.inLobby = false;
        this.inGame = false;
        this.players = [];
    }

    addPlayer(player) {
        if (this.players.length < 4) {
            this.players.push(player);
        } else {
            throw new Error("Room is full");
        }

        if (this.players.length === 2) {
            let timer = setInterval(() => {
                this.broadcast({
                    type: "timer_of_the_lobby",
                    roomId: this.id,
                });
            }, 1000);

            setTimeout(() => {
                clearInterval(timer);
                this.broadcast({
                    type: "room_update",
                    roomId: this.id,
                });
                this.inGame = true;
            }, 30000);
        }
    }

    broadcast(message) {
        this.players.forEach(player => {
            player.ws.send(JSON.stringify(message));
        });
    }

    getIdRoom() {
        return this.id;
    }

    get length() {
        return this.players.length;
    }
}

export default RoomsHandler;
