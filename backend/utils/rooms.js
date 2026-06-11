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

        if (lastRoom && lastRoom.length < 4 && !lastRoom.inGame) {
            lastRoom.addPlayer(player);
        } else {
            this.addRoom();
            this.Rooms.get([...this.Rooms.keys()].at(-1)).addPlayer(player);
        }
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
                    room.broadcastMessage(message);
                }
            }
        }
    }
}

const config = {
    waitTime: 10,
    startTime: 3,
    waitingText: "Waiting for players",
    startingText: "Starting the game",
};

class Room {
    constructor() {
        this.id = generateRandomDigits();
        this.inLobby = false;
        this.inGame = false;
        this.players = [];
        this.secondsLeft = config.waitTime;
        this.timer = null;
    }

    addPlayer(player) {
        if (this.players.length < 4) {
            this.players.push(player);
        } else {
            throw new Error("Room is full");
        }

        this.broadcastRoomUpdate();

        if (this.players.length === 2) {
            this.startCountdown();
        }
    }

    removePlayer(ws) {
        const playerIndex = this.players.findIndex(player => player.ws === ws);

        if (playerIndex === -1) return false;

        this.players.splice(playerIndex, 1);

        if (this.players.length === 0) {
            clearInterval(this.timer);
            this.timer = null;
            return true;
        }

        if (this.inGame) {
            clearInterval(this.timer);
            this.timer = null;
            this.inGame = false;
            this.inLobby = false;

            this.players[0].ws.send(JSON.stringify({
                type: "room_alone",
                winner: true,
            }));

            this.players = [];
            return true;
        }

        if (this.players.length === 1 && this.inLobby) {
            clearInterval(this.timer);
            this.timer = null;
            this.inLobby = false;
            this.secondsLeft = config.waitTime;
        }

        this.broadcastRoomUpdate();
        return true;
    }

    startCountdown() {
        this.inLobby = true;
        this.broadcastLobbyTimer();

        this.timer = setInterval(() => {
            this.secondsLeft--;

            if (this.secondsLeft <= 0 && !this.inGame) {
                this.inGame = true;
                this.secondsLeft = config.startTime;
                this.broadcastLobbyTimer();
                return;
            }

            if (this.secondsLeft <= 0 && this.inGame) {
                clearInterval(this.timer);
                this.timer = null;
                this.inLobby = false;

                this.broadcast({
                    type: "game_started",
                    roomId: this.id,
                    playersCount: this.players.length,
                });
                return;
            }

            this.broadcastLobbyTimer();
        }, 1000);
    }

    broadcastMessage(message) {
        this.broadcast({
            type: "chat_message",
            message: message,
        });
    }

    broadcastRoomUpdate() {
        this.broadcast({
            type: "room_update",
            roomId: this.id,
            playersCount: this.players.length,
            secondsLeft: this.timer ? this.secondsLeft : null,
            text: this.timer ? this.getLobbyText() : "Waiting for more players",
        });
    }

    broadcastLobbyTimer() {
        this.broadcast({
            type: "lobby_timer",
            roomId: this.id,
            playersCount: this.players.length,
            secondsLeft: this.secondsLeft,
            text: this.getLobbyText(),
        });
    }

    broadcast(message) {
        this.players.forEach(player => {
            player.ws.send(JSON.stringify(message));
        });
    }

    getIdRoom() {
        return this.id;
    }

    getLobbyText() {
        return this.inGame ? config.startingText : config.waitingText;
    }

    get length() {
        return this.players.length;
    }
}

export default RoomsHandler;
