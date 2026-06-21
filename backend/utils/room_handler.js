import { generateRandomDigits } from "./helpers.js";
import Player from "./player.js";
import GameMap from "./map.js";

const config = {
    waitTime: 10,
    startTime: 3,
};

// this represents a single room in the game
class Room {
    constructor() {
        this.id = generateRandomDigits();
        this.inGame = false;
        this.players = [];
        this.secondsLeft = config.waitTime;
        this.timer = null;
    }

    // this method add one player to the room
    addPlayer(player) {
        if (this.players.length < 4) {
            this.players.push(player);
        } else {
            throw new Error("Room is full");
        }

        this.broadcastLobbyState();

        if (this.players.length === 2) {
            this.startCountdown();
        }
    }

    // this method remove player form the room
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

            this.players[0].ws.send(JSON.stringify({
                type: "room_alone",
                winner: true,
            }));

            this.players = [];
            return true;
        }

        if (this.players.length === 1 && !this.inGame) {
            clearInterval(this.timer);
            this.timer = null;
            this.secondsLeft = config.waitTime;
        }

        this.broadcastLobbyState();
        return true;
    }

    // this method start the countdown for the game to start
    startCountdown() {
        this.broadcastLobbyState();

        this.timer = setInterval(() => {
            this.secondsLeft--;

            if (this.secondsLeft <= 0 && !this.inGame) {
                this.inGame = true;
                this.secondsLeft = config.startTime;
                this.broadcastLobbyState();
                return;
            }

            if (this.secondsLeft <= 0 && this.inGame) {
                clearInterval(this.timer);
                this.timer = null;

                const gameMap = new GameMap();

                this.broadcast({
                    type: "game_started",
                    roomId: this.id,
                    playersCount: this.players.length,
                    grid: gameMap.map,
                });
                return;
            }

            this.broadcastLobbyState();
        }, 1000);
    }

    // this is the main function that does broadcast to all the players in the room
    broadcast(message) {
        this.players.forEach(player => {
            player.ws.send(JSON.stringify(message));
        });
    }
    
    // this function to broadcast lobby state
    broadcastLobbyState() {
        this.broadcast({
            type: "lobby_update",
            roomId: this.id,
            players: this.players,
            secondsLeft: this.players.length > 1 ? this.secondsLeft : null,
            text: (this.secondsLeft && this.inGame) ? "Starting the game" : "Wainting for auther players"
        })
    }

    // this method is a getter for the length
    get length() {
        return this.players.length;
    }
}

export default Room;
