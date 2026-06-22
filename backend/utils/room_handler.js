import { generateRandomDigits } from "./helpers.js";
import Player from "./player.js";
import GameEngine from "./game_engine.js";

const LOBBY_CONFIG = {
    waitTime: 10,
    startTime: 3,
    waitingText: "Waiting for players",
    startingText: "Starting the game",
};

class Room extends GameEngine {
    constructor() {
        super();
        this.id = generateRandomDigits();
        this.inLobby = false;
        this.inGame = false;
        this.players = [];
        this.secondsLeft = LOBBY_CONFIG.waitTime;
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
            this.stopGameLoop();
            return true;
        }

        if (this.inGame) {
            clearInterval(this.timer);
            this.timer = null;
            this.stopGameLoop();
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
            this.secondsLeft = LOBBY_CONFIG.waitTime;
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
                this.secondsLeft = LOBBY_CONFIG.startTime;
                this.broadcastLobbyTimer();
                return;
            }

            if (this.secondsLeft <= 0 && this.inGame) {
                clearInterval(this.timer);
                this.timer = null;
                this.inLobby = false;

                this.startGame(this.players);

                this.players.forEach(player => {
                    player.ws.send(JSON.stringify({
                        type: "game_started",
                        roomId: this.id,
                        playersCount: this.players.length,
                        grid: this.gameMap.map,
                        players: this.getPublicPlayers(),
                        yourPlayerId: player.id,
                    }));
                });
                return;
            }

            this.broadcastLobbyTimer();
        }, 1000);
    }

    broadcastMessage(nickname, message) {
        this.broadcast({
            type: "chat_message",
            nickname: nickname,
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

    broadcast(message, exceptWs = null) {
        this.players.forEach(player => {
            if (player.ws === exceptWs) return;
            player.ws.send(JSON.stringify(message));
        });
    }

    getLobbyText() {
        return this.inGame ? LOBBY_CONFIG.startingText : LOBBY_CONFIG.waitingText;
    }

    getIdRoom() {
        return this.id;
    }

    get length() {
        return this.players.length;
    }
}

export default Room;