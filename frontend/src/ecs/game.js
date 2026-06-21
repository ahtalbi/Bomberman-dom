import { World } from './world.js';
import {
    PositionComponent,
    VelocityComponent,
    InputComponent,
    RenderableComponent,
    PlayerComponent,
    BombComponent
} from './components.js';

import { renderSystem } from './systems/renderSystem.js';
import { setBombs, setLives, setRange, setSpeed, TILE_SIZE } from '../pages/game';

const SPRITE_COLUMNS = 13;
const SPRITE_ROWS = 54;
const ANIMATION_ROWS = {
    RUN: { up: 38, left: 39, down: 40, right: 41 },
    IDLE: { up: 22, left: 23, down: 24, right: 25 }
};

export class GameEngine {
    constructor(canvasContainer, mapData, socket) {
        this.container = canvasContainer;
        this.mapData = mapData;
        this.socket = socket;
        this.world = new World();
        this.localPlayerEntity = null;
        this.playerEntities = new Map();
        this.lastTime = 0;
        this.removeInputListeners = null;
        this.animationFrame = null;
        this.running = false;
        this.claimedPowerUps = new Set();
        this.lastInputSent = "";
    }

    init(localPlayerId, allPlayers) {
        const normalizedLocalPlayerId = String(localPlayerId);

        allPlayers.forEach(pData => {
            const playerId = String(pData.id);
            const playerEntity = this.world.createEntity();
            const playerDiv = document.createElement('div');
            const color = pData.color || "white";

            playerDiv.className = `player player-${color}`;
            playerDiv.style.position = 'absolute';
            playerDiv.style.zIndex = '10';
            playerDiv.style.willChange = 'transform';
            playerDiv.style.width = `${TILE_SIZE}px`;
            playerDiv.style.height = `${TILE_SIZE}px`;
            playerDiv.style.backgroundSize = `${SPRITE_COLUMNS * TILE_SIZE}px ${SPRITE_ROWS * TILE_SIZE}px`;
            this.container.appendChild(playerDiv);

            const sx = pData.x || 1;
            const sy = pData.y || 1;

            this.world.addComponent(playerEntity, 'Position', PositionComponent(sx, sy, TILE_SIZE));
            this.world.addComponent(playerEntity, 'Velocity', VelocityComponent(pData.speed || 2.5));
            this.world.addComponent(playerEntity, 'Renderable', RenderableComponent(playerDiv, TILE_SIZE, TILE_SIZE, 4, 12)
            );

            const isLocal = playerId === normalizedLocalPlayerId;
            const playerComp = PlayerComponent(playerId, color, isLocal);
            playerComp.lives = pData.lives ?? 3;
            playerComp.maxBombs = pData.maxBombs ?? 1;
            playerComp.bombRange = pData.bombRange ?? 2;
            playerComp.alive = pData.alive ?? true;
            this.world.addComponent(playerEntity, 'Player', playerComp);
            this.playerEntities.set(playerId, playerEntity);

            if (isLocal) {
                this.localPlayerEntity = playerEntity;
                this.world.addComponent(playerEntity, 'Input', InputComponent());
                this.updateHudStats(playerEntity);
                this.setupInput();
            }
        });

        if (this.localPlayerEntity === null) {
            console.warn("[GameEngine] Local player was not found", {
                localPlayerId,
                players: allPlayers.map(player => player.id),
            });
        }

        this.registerSystems();

        this.running = true;
        this.lastTime = performance.now();
        this.animationFrame = requestAnimationFrame((now) => this.gameLoop(now));
    }

    setupInput() {
        const input = this.world.getComponent(this.localPlayerEntity, 'Input');
        if (!input) return;

        const getKeyDirection = (key) => {
            if (key === 'ArrowUp' || key === 'w' || key === 'Z' || key === 'z') return 'up';
            if (key === 'ArrowDown' || key === 's' || key === 'S') return 'down';
            if (key === 'ArrowLeft' || key === 'a' || key === 'Q' || key === 'q') return 'left';
            if (key === 'ArrowRight' || key === 'd' || key === 'D') return 'right';
            return null;
        };

        const handleKeyDown = (e) => {
            const dir = getKeyDirection(e.key);
            if (dir && input) {
                e.preventDefault();
                if (!input.inputQueue.includes(dir)) {
                    input.inputQueue.unshift(dir);
                }
                this.sendInput(input);
            }

            if (e.key === ' ' || e.code === 'Space') {
                e.preventDefault();
                this.dropBomb();
            }
        };

        const handleKeyUp = (e) => {
            const dir = getKeyDirection(e.key);
            if (dir && input) {
                input.inputQueue = input.inputQueue.filter(d => d !== dir);
                this.sendInput(input);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        this.removeInputListeners = () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }

    sendInput(input) {
        if (!this.socket || this.socket.readyState !== WebSocket.OPEN) return;
        if (this.localPlayerEntity === null) return;

        const player = this.world.getComponent(this.localPlayerEntity, 'Player');
        if (!player || !player.alive) return;

        const direction = input.inputQueue[0] || null;
        const isMoving = Boolean(direction);
        const inputState = `${direction || 'idle'}:${isMoving ? 1 : 0}`;

        if (this.lastInputSent === inputState) return;
        this.lastInputSent = inputState;

        this.socket.send(JSON.stringify({
            type: 'MOVE_STATE',
            payload: { direction, isMoving }
        }));
    }

    dropBomb() {
        if (this.localPlayerEntity === null) return;

        const player = this.world.getComponent(this.localPlayerEntity, 'Player');
        if (!player || !player.alive) return;

        const currentBombs = this.world.query('Position', 'Bomb').filter(bEntity => {
            return this.world.getComponent(bEntity, 'Bomb').ownerId === player.id;
        });

        if (currentBombs.length >= player.maxBombs) return;

        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify({
                type: 'DROP_BOMB',
                payload: {}
            }));
        }
    }

    createBomb(ownerId, gridX, gridY, range, bombId = null) {
        const exists = this.world.query('Position', 'Bomb').some(entity => {
            const pos = this.world.getComponent(entity, 'Position');
            const bomb = this.world.getComponent(entity, 'Bomb');
            return (bombId && bomb.bombId === bombId) ||
                (bomb.ownerId === ownerId && pos.gridX === gridX && pos.gridY === gridY);
        });

        if (exists) return false;

        const bombEntity = this.world.createEntity();
        const bombDiv = document.createElement('div');
        bombDiv.className = 'bomb';
        bombDiv.style.position = 'absolute';
        bombDiv.style.width = `${TILE_SIZE}px`;
        bombDiv.style.height = `${TILE_SIZE}px`;
        bombDiv.style.left = `${gridX * TILE_SIZE}px`;
        bombDiv.style.top = `${gridY * TILE_SIZE}px`;
        bombDiv.style.zIndex = '6';
        this.container.appendChild(bombDiv);

        this.world.addComponent(bombEntity, 'Position', { gridX, gridY });

        const bombComp = BombComponent(ownerId, 2000, range);
        bombComp.bombId = bombId;
        bombComp.el = bombDiv;
        this.world.addComponent(bombEntity, 'Bomb', bombComp);
        return true;
    }

    handleRemoteMove(payload) {
        if (!payload || !payload.id) {
            console.warn("[handleRemoteMove] Invalid payload:", payload);
            return;
        }

        let entity = this.playerEntities.get(String(payload.id));
        if (entity === undefined) {
            console.warn(`[handleRemoteMove] Entity not found for player ${payload.id}. Available players:`, Array.from(this.playerEntities.keys()));
            return;
        }

        const pos = this.world.getComponent(entity, 'Position');
        const vel = this.world.getComponent(entity, 'Velocity');
        const renderable = this.world.getComponent(entity, 'Renderable');
        
        if (!pos || !vel || !renderable) {
            console.warn(`[handleRemoteMove] Missing components for player ${payload.id}:`, { pos: !!pos, vel: !!vel, renderable: !!renderable });
            return;
        }

        vel.direction = payload.direction || vel.direction;
        vel.isMoving = payload.isMoving;
        pos.gridX = payload.gridX;
        pos.gridY = payload.gridY;
        pos.targetX = payload.x;
        pos.targetY = payload.y;
        pos.x = payload.x;
        pos.y = payload.y;

        renderable.state = payload.state || (payload.isMoving ? 'RUN' : 'IDLE');
    }

    handleRemoteBomb(payload) {
        if (!payload || !payload.id) return;
        this.createBomb(payload.id, payload.x, payload.y, payload.range || 2, payload.bombId);
    }

    handleRemotePowerUpPicked(payload) {
        if (!payload || payload.x === undefined || payload.y === undefined) return;

        this.removePowerUpAt(payload.x, payload.y);

        const entity = this.playerEntities.get(String(payload.id));
        if (entity === undefined) return;

        if (payload.stats) {
            this.applyServerStats(entity, payload.stats);
        }

        if (entity === this.localPlayerEntity) {
            this.updateHudStats(entity);
        }
    }

    removePowerUpAt(gridX, gridY) {
        this.claimedPowerUps.add(`${gridX},${gridY}`);
        const powerUps = this.world.query('Position', 'PowerUp');

        for (const entity of powerUps) {
            const pos = this.world.getComponent(entity, 'Position');
            const powerUp = this.world.getComponent(entity, 'PowerUp');
            if (!pos || !powerUp) continue;

            if (pos.gridX === gridX && pos.gridY === gridY) {
                powerUp.pickedUp = true;

                if (powerUp.el && powerUp.el.parentNode) {
                    powerUp.el.parentNode.removeChild(powerUp.el);
                }

                this.world.destroyEntity(entity);
                return;
            }
        }
    }

    applyServerStats(entity, stats) {
        const player = this.world.getComponent(entity, 'Player');
        const velocity = this.world.getComponent(entity, 'Velocity');
        if (!player || !stats) return;

        player.lives = stats.lives ?? player.lives;
        player.maxBombs = stats.maxBombs ?? player.maxBombs;
        player.bombRange = stats.bombRange ?? player.bombRange;
        player.alive = stats.alive ?? player.alive;

        if (velocity && typeof stats.speed === 'number') {
            velocity.speed = stats.speed;
        }
    }

    handlePlayerDamaged(payload) {
        if (!payload || !payload.id) return;

        const entity = this.playerEntities.get(String(payload.id));
        if (entity === undefined) return;

        const player = this.world.getComponent(entity, 'Player');
        if (!player) return;

        player.lives = payload.lives ?? player.lives;
        player.alive = payload.alive ?? player.alive;

        if (!player.alive) {
            const velocity = this.world.getComponent(entity, 'Velocity');
            if (velocity) velocity.isMoving = false;

            if (entity === this.localPlayerEntity) {
                this.world.removeComponent(entity, 'Input');
            }
        }

        if (entity === this.localPlayerEntity) {
            setLives(player.lives);
        }
    }

    handleGameOver(payload) {
        this.running = false;
        const winnerName = payload && payload.winnerName ? payload.winnerName : "A player";
        setTimeout(() => alert(`${winnerName} wins!`), 50);
    }

    handleExplosionChecked(payload) {
        if (!payload) return;

        this.removeBomb(payload.bombId, payload.cells && payload.cells[0]);

        (payload.destroyedBlocks || []).forEach(cell => {
            this.updateMapCell(cell.x, cell.y, 2);
        });

        (payload.spawnedPowerUps || []).forEach(powerUp => {
            this.createPowerUp(powerUp.x, powerUp.y, powerUp.type);
        });

        (payload.cells || []).forEach(cell => {
            this.createExplosion(cell.x, cell.y, 500);
        });
    }

    updateMapCell(x, y, newValue) {
        if (!this.mapData[y]) return;

        this.mapData[y][x] = newValue;

        const tile = this.container.querySelector(`[data-x="${x}"][data-y="${y}"]`);
        if (!tile) return;

        tile.className = 'tile tile-floor';
        tile.style.backgroundImage = 'url("./assets/blocks/block_floor.jpg")';
    }

    removeBomb(bombId, fallbackCell) {
        const bombs = this.world.query('Position', 'Bomb');

        for (const entity of bombs) {
            const pos = this.world.getComponent(entity, 'Position');
            const bomb = this.world.getComponent(entity, 'Bomb');
            const sameId = bombId && bomb && bomb.bombId === bombId;
            const sameCell = fallbackCell && pos && pos.gridX === fallbackCell.x && pos.gridY === fallbackCell.y;

            if (!sameId && !sameCell) continue;

            if (bomb.el && bomb.el.parentNode) {
                bomb.el.parentNode.removeChild(bomb.el);
            }

            this.world.destroyEntity(entity);
            return;
        }
    }

    createExplosion(gridX, gridY, duration) {
        const expEntity = this.world.createEntity();
        const expDiv = document.createElement('div');
        expDiv.className = 'explosion';
        expDiv.style.position = 'absolute';
        expDiv.style.width = `${TILE_SIZE}px`;
        expDiv.style.height = `${TILE_SIZE}px`;
        expDiv.style.left = `${gridX * TILE_SIZE}px`;
        expDiv.style.top = `${gridY * TILE_SIZE}px`;
        expDiv.style.zIndex = '7';
        this.container.appendChild(expDiv);

        this.world.addComponent(expEntity, 'Position', { gridX, gridY, x: gridX * TILE_SIZE, y: gridY * TILE_SIZE });
        this.world.addComponent(expEntity, 'Explosion', { duration, el: expDiv });

        setTimeout(() => {
            if (expDiv.parentNode) {
                expDiv.parentNode.removeChild(expDiv);
            }
            this.world.destroyEntity(expEntity);
        }, duration);
    }

    createPowerUp(gx, gy, type) {
        if (!type || this.claimedPowerUps.has(`${gx},${gy}`)) return;

        const pUpEntity = this.world.createEntity();
        this.world.addComponent(pUpEntity, 'Position', { gridX: gx, gridY: gy, x: gx * TILE_SIZE, y: gy * TILE_SIZE });

        const div = document.createElement('div');
        div.className = `powerup powerup-${type.toLowerCase()}`;
        div.style.position = 'absolute';
        div.style.width = `${TILE_SIZE}px`;
        div.style.height = `${TILE_SIZE}px`;
        div.style.left = `${gx * TILE_SIZE}px`;
        div.style.top = `${gy * TILE_SIZE}px`;
        div.style.zIndex = '5';
        this.container.appendChild(div);

        this.world.addComponent(pUpEntity, 'PowerUp', { type, el: div });
    }

    registerSystems() {
        this.world.addSystem((w, dt, now) => renderSystem(w, dt, now, ANIMATION_ROWS));
    }

    gameLoop(now) {
        if (!this.running) return;

        const dt = now - this.lastTime;
        this.lastTime = now;
        this.world.update(dt, now);
        if (this.localPlayerEntity !== null) {
            this.updateHudStats(this.localPlayerEntity);
        }
        this.animationFrame = requestAnimationFrame((nextNow) => this.gameLoop(nextNow));
    }

    destroy() {
        this.running = false;

        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }

        if (this.removeInputListeners) {
            this.removeInputListeners();
        }
    }

    updateHudStats(entity) {
        const player = this.world.getComponent(entity, 'Player');
        const velocity = this.world.getComponent(entity, 'Velocity');
        if (!player || !velocity) return;

        setBombs(player.maxBombs || 1);
        setLives(player.lives ?? 3);
        setRange(player.bombRange || 4);
        setSpeed(Math.round(velocity.speed));
    }
}

let currentLocalPlayerName = "";

export function setPlayerName(name) {
    currentLocalPlayerName = name;
    localStorage.setItem("bomberman_player_name", name);
    console.log("Player registered successfully", name);
}

export function getPlayerName() {
    return currentLocalPlayerName || localStorage.getItem("bomberman_player_name") || "Player";
}
