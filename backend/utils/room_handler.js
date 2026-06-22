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

        this.broadcastLobbyUpdate();

        if (this.players.length === 2) {
            this.startCountdown();
        }

        if (this.players.length === 4 && !this.inGame) {
            clearInterval(this.timer);
            this.timer = null;
            this.secondsLeft = LOBBY_CONFIG.startTime;
            this.startCountdown();
        }
    }

    removePlayer(ws) {
        const playerIndex = this.players.findIndex(player => player.ws === ws);
        const disconnectedPlayer = playerIndex !== -1 ? this.players[playerIndex] : null;

        if (playerIndex === -1) return false;

        this.players.splice(playerIndex, 1);

        if (this.inGame && disconnectedPlayer) {
            this.playerStates.delete(disconnectedPlayer.id);
        }

        if (this.players.length === 0) {
            clearInterval(this.timer);
            this.timer = null;
            this.stopGameLoop();
            return true;
        }

        if (this.inGame) {
            if ([...this.playerStates.values()].filter(p => p.alive).length === 0) {
                this.stopGameLoop();
                this.inGame = false;
            }

            this.broadcastLobbyUpdate();
            return true;
        }

        if (this.players.length === 1 && !this.inGame) {
            clearInterval(this.timer);
            this.timer = null;
            this.secondsLeft = LOBBY_CONFIG.waitTime;
        }

        this.broadcastLobbyUpdate();
        return true;
    }

    startCountdown() {
        this.broadcastLobbyUpdate();

        this.timer = setInterval(() => {
            this.secondsLeft--;

            if (this.secondsLeft <= 0 && !this.inGame) {
                this.inGame = true;
                this.secondsLeft = LOBBY_CONFIG.startTime;
                this.broadcastLobbyUpdate();
                return;
            }

            if (this.secondsLeft <= 0 && this.inGame) {
                clearInterval(this.timer);
                this.timer = null;

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

            this.broadcastLobbyUpdate();
        }, 1000);
    }

    broadcastMessage(nickname, message) {
        this.broadcast({
            type: "chat_message",
            nickname: nickname,
            message: message,
        });
    }

    broadcastLobbyUpdate() {
        this.broadcast({
            type: "lobby_update",
            roomId: this.id,
            playersCount: this.players.length,
            secondsLeft: this.secondsLeft == LOBBY_CONFIG.waitTime ? 0 : this.secondsLeft,
            text: this.inGame ? LOBBY_CONFIG.startingText : LOBBY_CONFIG.waitingText,
        });
    }

    broadcast(message, exceptWs = null) {
        this.players.forEach(player => {
            if (player.ws === exceptWs) return;
            player.ws.send(JSON.stringify(message));
        });
    }

    get length() {
        return this.players.length;
    }
}

export default Room;