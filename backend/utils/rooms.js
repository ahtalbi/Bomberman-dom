import { generateRandomDigits } from "./helpers";

class RoomsHandler {
    constructor() {
        this.Rooms = new Map();
    }

    addRoom() {
        let room = new Room();
        let id = room.getIdRoom();
        this.Rooms.set(id, room);
    }

    addPlayerToRoom(nickname) {
        const lastKey = [...this.Rooms.keys()].at(-1);
        const lastRoom = this.Rooms.get(lastKey);

        if (lastRoom && lastRoom.length < 4) {
            lastRoom.addPlayer({ nickname });
        } else {
            this.addRoom();
            this.Rooms.get([...this.Rooms.keys()].at(-1)).addPlayer({ nickname });
        }
    }
}

class Room {
    constructor() {
        this.id = generateRandomDigits();

        this.players = [];
    }

    addPlayer(player) {
        if (this.players.length < 4) {
            this.players.push(player);
        } else {
            throw new Error("Room is full");
        }
    }

    getIdRoom() {
        return this.id;
    }
    
    get length() {
        return this.players.length;
    }
}

export default RoomsHandler;