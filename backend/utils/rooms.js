import { generateRandomDigits } from "./helpers.js";
import Player from "./player.js";
import GameMap from "./map.js";
import {
    acceptMovement,
    applyPowerUp,
    bombDelay,
    calculateExplosionCells,
    createPlayerState,
    damagePlayers,
    powerUpForCell,
    publicMove,
    publicPlayer,
    publicStats,
} from "./gameState.js";

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
            this.addRoom();
            this.Rooms.get([...this.Rooms.keys()].at(-1)).addPlayer(new Player(nickname, ws));
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

    pickPowerUp(ws, payload) {
        const room = this.getRoomBySocket(ws);
        if (room) room.pickPowerUp(ws, payload);
    }
}

const config = {
    waitTime: 10,
    startTime: 3,
    waitingText: "Waiting for players",
    startingText: "Starting the game",
    colors: ["white", "red", "blue", "black"],
    starts: [
        { x: 1, y: 1 },
        { x: 15, y: 15 },
        { x: 15, y: 1 },
        { x: 1, y: 15 },
    ],
};

class Room {
    constructor() {
        this.id = generateRandomDigits();
        this.inLobby = false;
        this.inGame = false;
        this.players = [];
        this.secondsLeft = config.waitTime;
        this.timer = null;
        this.gameMap = null;
        this.playerStates = new Map();
        this.bombs = new Map();
        this.powerUps = new Map();
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
            this.clearBombTimers();
            return true;
        }

        if (this.inGame) {
            clearInterval(this.timer);
            this.timer = null;
            this.clearBombTimers();
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

                this.startGame();

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

    startGame() {
        this.gameMap = new GameMap();
        this.playerStates.clear();
        this.bombs.clear();
        this.powerUps.clear();

        this.players.forEach((player, index) => {
            this.playerStates.set(
                player.id,
                createPlayerState(player, config.starts[index], config.colors[index])
            );
        });
    }

    handleMove(ws, payload) {
        if (!this.inGame || !this.gameMap) return;

        const state = this.getPlayerStateBySocket(ws);
        if (!state) return;

        if (acceptMovement(state, payload, this.gameMap.map)) {
            this.broadcast({
                type: "player_moved",
                payload: publicMove(state),
            });
            return;
        }

        ws.send(JSON.stringify({
            type: "player_moved",
            payload: publicMove(state, true),
        }));
    }

    dropBomb(ws) {
        if (!this.inGame || !this.gameMap) return;

        const state = this.getPlayerStateBySocket(ws);
        if (!state || !state.alive) return;
        if (state.activeBombs >= state.maxBombs) return;

        const occupied = [...this.bombs.values()].some(bomb => {
            return bomb.x === state.gridX && bomb.y === state.gridY;
        });

        if (occupied) return;

        const bomb = {
            id: generateRandomDigits(12),
            ownerId: state.id,
            x: state.gridX,
            y: state.gridY,
            range: state.bombRange,
            timer: null,
        };

        state.activeBombs++;
        bomb.timer = setTimeout(() => this.explodeBomb(bomb.id), bombDelay());
        this.bombs.set(bomb.id, bomb);

        this.broadcast({
            type: "bomb_dropped",
            payload: {
                id: state.id,
                bombId: bomb.id,
                x: bomb.x,
                y: bomb.y,
                range: bomb.range,
            },
        });
    }

    explodeBomb(bombId) {
        const bomb = this.bombs.get(bombId);
        if (!bomb || !this.gameMap) return;

        this.bombs.delete(bombId);

        const owner = this.playerStates.get(bomb.ownerId);
        if (owner) owner.activeBombs = Math.max(owner.activeBombs - 1, 0);

        const cells = calculateExplosionCells(bomb.x, bomb.y, bomb.range, this.gameMap.map);
        const destroyedBlocks = [];
        const spawnedPowerUps = [];

        for (const cell of cells) {
            if (!this.gameMap.map[cell.y] || this.gameMap.map[cell.y][cell.x] !== 4) continue;

            this.gameMap.map[cell.y][cell.x] = 2;
            destroyedBlocks.push(cell);

            const type = powerUpForCell(cell.x, cell.y);
            if (type) {
                const key = this.cellKey(cell.x, cell.y);
                const powerUp = { x: cell.x, y: cell.y, type };
                this.powerUps.set(key, powerUp);
                spawnedPowerUps.push(powerUp);
            }
        }

        const damagedPlayers = damagePlayers(this.playerStates, cells);

        this.broadcast({
            type: "explosion_checked",
            payload: {
                bombId,
                cells,
                destroyedBlocks,
                spawnedPowerUps,
            },
        });

        damagedPlayers.forEach(player => {
            this.broadcast({
                type: "player_damaged",
                payload: player,
            });
        });

        this.checkWinner();
    }

    pickPowerUp(ws, payload = {}) {
        if (!this.inGame || !this.gameMap) return;

        const state = this.getPlayerStateBySocket(ws);
        if (!state || !state.alive) return;

        const x = Number(payload.x);
        const y = Number(payload.y);
        if (!Number.isFinite(x) || !Number.isFinite(y)) return;
        if (state.gridX !== x || state.gridY !== y) return;

        const key = this.cellKey(x, y);
        const powerUp = this.powerUps.get(key);
        if (!powerUp) return;

        this.powerUps.delete(key);
        applyPowerUp(state, powerUp.type);

        this.broadcast({
            type: "powerup_picked",
            payload: {
                id: state.id,
                type: powerUp.type,
                x,
                y,
                stats: publicStats(state),
            },
        });
    }

    checkWinner() {
        const alivePlayers = [...this.playerStates.values()].filter(player => player.alive);
        if (alivePlayers.length !== 1) return;

        this.broadcast({
            type: "game_over",
            payload: {
                winnerId: alivePlayers[0].id,
                winnerName: alivePlayers[0].nickname,
            },
        });

        this.clearBombTimers();
        this.inGame = false;
    }

    getPlayerStateBySocket(ws) {
        const player = this.players.find(player => player.ws === ws);
        return player ? this.playerStates.get(player.id) : null;
    }

    getPublicPlayers() {
        return [...this.playerStates.values()].map(player => publicPlayer(player));
    }

    clearBombTimers() {
        for (const bomb of this.bombs.values()) {
            clearTimeout(bomb.timer);
        }
        this.bombs.clear();
    }

    cellKey(x, y) {
        return `${x},${y}`;
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
