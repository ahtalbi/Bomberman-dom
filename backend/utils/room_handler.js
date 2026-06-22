import { generateRandomDigits } from "./helpers.js";
import Player from "./player.js";
import GameEngine from "./game_engine.js";

const LOBBY_CONFIG = {
    waitTime: 20,
    startTime: 10,
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
        this.deadPlayers = new Set();
        this.initialPlayerCount = 0;
        this.lockedInPlayers = null;
    }

    addPlayer(player) {
        if (this.players.length < 4) {
            this.players.push(player);
        } else {
            throw new Error("Room is full");
        }

        this.broadcastLobbyUpdate();

        if (this.players.length === 2 && !this.inLobby && !this.inGame) {
            this.startCountdown();
        } else if (this.players.length === 4 && this.inLobby && !this.inGame) {
            this.inGame = true;
            this.secondsLeft = LOBBY_CONFIG.startTime;
            this.lockedInPlayers = [...this.players];
            this.broadcastLobbyUpdate();
        }
    }

    removePlayer(ws) {
        const playerIndex = this.players.findIndex(player => player.ws === ws);
        if (playerIndex === -1) return false;

        const disconnectedPlayer = this.players[playerIndex];
        const disconnectedSocketId = disconnectedPlayer.socketId;

        if (this.inGame && this.inLobby) {
            this.players.splice(playerIndex, 1);
            if (this.lockedInPlayers) {
                const snapshotPlayer = this.lockedInPlayers.find(p => p.ws === ws);
                if (snapshotPlayer) snapshotPlayer.disconnected = true;
            }

            if (this.players.length === 1) {
                clearInterval(this.timer);
                this.timer = null;
                this.inLobby = false;
                this.inGame = false;
                this.secondsLeft = LOBBY_CONFIG.waitTime;
                this.lockedInPlayers = null;

                this.broadcast({ type: "lobby_reset" });
                this.broadcastLobbyUpdate();
            } else {
                this.broadcastLobbyUpdate();
            }
            return true;
        }

        this.players.splice(playerIndex, 1);

        if (this.players.length === 0) {
            clearInterval(this.timer);
            this.timer = null;
            this.stopGameLoop();
            return true;
        }

        if (this.inGame && !this.inLobby) {
            if (disconnectedPlayer) {
                this.playerStates.delete(disconnectedPlayer.id);
            }
            const aliveRemaining = this.checkWinCondition(disconnectedSocketId);
            if (aliveRemaining <= 1) {
                this.stopGameLoop();
                this.inGame = false;
                this.isGameOver = true;
                if (this.onGameOver) this.onGameOver();
            }
            return true;
        }

        if (this.players.length === 1 && this.inLobby && !this.inGame) {
            clearInterval(this.timer);
            this.timer = null;
            this.inLobby = false;
            this.secondsLeft = LOBBY_CONFIG.waitTime;
        }

        this.broadcastLobbyUpdate();
        return true;
    }

    getAlivePlayersCount() {
        return this.initialPlayerCount - this.deadPlayers.size;
    }

    checkWinCondition(deadSocketId) {
        try {
            if (deadSocketId && !this.deadPlayers.has(deadSocketId)) {
                this.deadPlayers.add(deadSocketId);
            }

            const aliveCount = this.initialPlayerCount - this.deadPlayers.size;

            if (aliveCount === 1) {
                const winner = this.players.find(p => !this.deadPlayers.has(p.socketId));
                if (winner) {
                    this.broadcast({
                        type: "game_won",
                        winnerName: winner.nickname
                    });
                }
            } else if (aliveCount > 1 && deadSocketId) {
                const deadPlayer = this.lockedInPlayers.find(p => p.socketId === deadSocketId);
                if (deadPlayer) {
                    this.broadcast({
                        type: "player_turned_heart",
                        playerId: deadPlayer.id
                    });
                }
            } else if (aliveCount === 0 && this.players.length > 0) {
                this.broadcast({
                    type: "game_won",
                    winnerName: "Nobody - All players eliminated"
                });
            }

            return aliveCount;
        } catch (error) {
            return -1;
        }
    }

    startCountdown() {
        this.inLobby = true;
        this.broadcastLobbyUpdate();

        this.timer = setInterval(() => {
            this.secondsLeft--;

            if (this.secondsLeft <= 0 && !this.inGame) {
                this.inGame = true;
                this.secondsLeft = LOBBY_CONFIG.startTime;
                this.lockedInPlayers = [...this.players];
                this.broadcastLobbyUpdate();
                return;
            }

            if (this.secondsLeft <= 0 && this.inGame) {
                clearInterval(this.timer);
                this.timer = null;
                this.inLobby = false;

                this.initialPlayerCount = this.lockedInPlayers.length;

                this.lockedInPlayers.forEach(p => {
                    if (p.disconnected) {
                        this.deadPlayers.add(p.socketId);
                    }
                });

                this.startGame(this.players);

                this.players.forEach(player => {
                    player.ws.send(JSON.stringify({
                        type: "game_started",
                        roomId: this.id,
                        playersCount: this.lockedInPlayers.length,
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