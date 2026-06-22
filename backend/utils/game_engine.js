import { generateRandomDigits } from "./helpers.js";
import GameMap from "./map.js";
import {
    applyPowerUp,
    bombDelay,
    canReadInput,
    calculateExplosionCells,
    createPlayerState,
    damagePlayers,
    isSpeedBoostExpired,
    powerUpForCell,
    publicMove,
    publicPlayer,
    publicStats,
    updateMovement,
    updatePlayerInput,
} from "./gameState.js";

const GAME_CONFIG = {
    colors: ["white", "red", "blue", "black"],
    starts: [
        { x: 1, y: 1 },
        { x: 15, y: 15 },
        { x: 15, y: 1 },
        { x: 1, y: 15 },
    ],
};

class GameEngine {
    constructor() {
        this.gameMap = null;
        this.playerStates = new Map();
        this.bombs = new Map();
        this.powerUps = new Map();
        this.gameLoop = null;
        this.lastTick = 0;
    }

    startGame(players) {
        this.gameMap = new GameMap();
        this.playerStates.clear();
        this.bombs.clear();
        this.powerUps.clear();
        this.lastTick = Date.now();

        players.forEach((player, index) => {
            this.playerStates.set(
                player.id,
                createPlayerState(player, GAME_CONFIG.starts[index], GAME_CONFIG.colors[index])
            );
        });

        this.gameLoop = setInterval(() => this.tick(), 16);
    }

    tick() {
        if (!this.inGame || !this.gameMap) return;

        const now = Date.now();
        const dt = now - this.lastTick;
        this.lastTick = now;

        for (const state of this.playerStates.values()) {
            if (isSpeedBoostExpired(state)) {
                this.broadcast({
                    type: "powerup_expired",
                    payload: {
                        id: state.id,
                        type: "SPEED",
                        stats: publicStats(state),
                    },
                });
            }

            if (updateMovement(state, this.gameMap.map, dt)) {
                this.broadcast({
                    type: "player_moved",
                    payload: publicMove(state),
                });
            }

            this.pickPowerUpForPlayer(state);
        }
    }

    handleMove(ws, payload) {
        if (!this.inGame || !this.gameMap) return;

        const state = this.getPlayerStateBySocket(ws);
        if (!state) return;
        if (!canReadInput(state)) return;

        updatePlayerInput(state, payload);
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

        this.stopGameLoop();
        this.inGame = false;
    }

    pickPowerUpForPlayer(state) {
        if (!state || !state.alive) return;

        const key = this.cellKey(state.gridX, state.gridY);
        const powerUp = this.powerUps.get(key);
        if (!powerUp) return;

        this.powerUps.delete(key);
        applyPowerUp(state, powerUp.type);

        this.broadcast({
            type: "powerup_picked",
            payload: {
                id: state.id,
                type: powerUp.type,
                x: powerUp.x,
                y: powerUp.y,
                stats: publicStats(state),
            },
        });
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

    stopGameLoop() {
        if (this.gameLoop) {
            clearInterval(this.gameLoop);
            this.gameLoop = null;
        }

        this.clearBombTimers();
    }

    cellKey(x, y) {
        return `${x},${y}`;
    }
}

export default GameEngine;