import { World } from './world.js';
import {
    PositionComponent,
    VelocityComponent,
    InputComponent,
    RenderableComponent,
    PlayerComponent,
    BombComponent
} from './components.js';

import { movementSystem } from './systems/movementSystem.js';
import { renderSystem } from './systems/renderSystem.js';
import { bombSystem } from './systems/bombSystem.js';
import { damageSystem, checkExtraLifeCollision, checkGameEndConditions } from './systems/damageSystem.js';
import { powerUpSystem, spawnPowerUp } from './systems/powerUpSystem.js';
import { setBombs, setLives, setRange, setSpeed } from '../pages/game';

const TILE_SIZE = 64;
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
    }

    init(localPlayerId, allPlayers) {
        this.totalPlayers = allPlayers.length;
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
            this.container.appendChild(playerDiv);

            const sx = pData.x || 1;
            const sy = pData.y || 1;

            this.world.addComponent(playerEntity, 'Position', PositionComponent(sx, sy, TILE_SIZE));
            this.world.addComponent(playerEntity, 'Velocity', VelocityComponent(2.5));
            this.world.addComponent(playerEntity, 'Renderable', RenderableComponent(playerDiv, 64, 64, 4, 12)
            );

            const isLocal = playerId === normalizedLocalPlayerId;
            const playerComp = PlayerComponent(playerId, color, isLocal);
            playerComp.lives = 3;
            playerComp.maxBombs = 1;
            playerComp.bombRange = 4;
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
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        this.removeInputListeners = () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }

    dropBomb() {
        if (this.localPlayerEntity === null) return;

        const pos = this.world.getComponent(this.localPlayerEntity, 'Position');
        const player = this.world.getComponent(this.localPlayerEntity, 'Player');

        const currentBombs = this.world.query('Position', 'Bomb').filter(bEntity => {
            return this.world.getComponent(bEntity, 'Bomb').ownerId === player.id;
        });

        if (currentBombs.length >= player.maxBombs) return;

        const created = this.createBomb(player.id, pos.gridX, pos.gridY, player.bombRange);
        if (!created) return;

        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify({
                type: 'DROP_BOMB',
                payload: { id: player.id, x: pos.gridX, y: pos.gridY, range: player.bombRange }
            }));
        }
    }

    createBomb(ownerId, gridX, gridY, range) {
        const exists = this.world.query('Position', 'Bomb').some(entity => {
            const pos = this.world.getComponent(entity, 'Position');
            const bomb = this.world.getComponent(entity, 'Bomb');
            return bomb.ownerId === ownerId && pos.gridX === gridX && pos.gridY === gridY;
        });

        if (exists) return false;

        const bombEntity = this.world.createEntity();
        const bombDiv = document.createElement('div');
        bombDiv.className = 'bomb';
        bombDiv.style.position = 'absolute';
        bombDiv.style.left = `${gridX * TILE_SIZE}px`;
        bombDiv.style.top = `${gridY * TILE_SIZE}px`;
        bombDiv.style.zIndex = '6';
        this.container.appendChild(bombDiv);

        this.world.addComponent(bombEntity, 'Position', { gridX, gridY });

        const bombComp = BombComponent(ownerId, 2000, range);
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

        if (entity === this.localPlayerEntity) {
            console.log(`[handleRemoteMove] Ignoring local player update for ${payload.id}`);
            return;
        }

        const pos = this.world.getComponent(entity, 'Position');
        const vel = this.world.getComponent(entity, 'Velocity');
        const renderable = this.world.getComponent(entity, 'Renderable');
        
        if (!pos || !vel || !renderable) {
            console.warn(`[handleRemoteMove] Missing components for player ${payload.id}:`, { pos: !!pos, vel: !!vel, renderable: !!renderable });
            return;
        }

        console.log(`[handleRemoteMove] Updating player ${payload.id} to (${payload.gridX}, ${payload.gridY})`);
        vel.direction = payload.direction || vel.direction;
        vel.isMoving = payload.isMoving;
        pos.gridX = payload.gridX;
        pos.gridY = payload.gridY;
        pos.targetX = payload.x;
        pos.targetY = payload.y;
        renderable.state = payload.state || (payload.isMoving ? 'RUN' : 'IDLE');
    }

    handleRemoteBomb(payload) {
        if (!payload || !payload.id) return;
        this.createBomb(payload.id, payload.x, payload.y, payload.range || 4);
    }

    handleRemotePowerUpPicked(payload) {
        if (!payload || payload.x === undefined || payload.y === undefined) return;

        this.removePowerUpAt(payload.x, payload.y);

        const entity = this.playerEntities.get(String(payload.id));
        if (entity === undefined || entity === this.localPlayerEntity) return;

        this.applyPowerUp(entity, payload.type);
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

    applyPowerUp(entity, type) {
        const player = this.world.getComponent(entity, 'Player');
        const velocity = this.world.getComponent(entity, 'Velocity');
        if (!player || !velocity) return;

        if (type === 'SPEED') {
            velocity.speed = Math.min(velocity.speed + 1, 8);
        } else if (type === 'BOMBS') {
            player.maxBombs = player.maxBombs ? player.maxBombs + 1 : 2;
        } else if (type === 'FLAME') {
            player.bombRange = player.bombRange ? player.bombRange + 1 : 5;
        }
    }

    registerSystems() {
        const updateMapCell = (x, y, newValue) => {
            if (!this.mapData[y]) return;

            this.mapData[y][x] = newValue;

            const tile = this.container.querySelector(`[data-x="${x}"][data-y="${y}"]`);
            if (!tile) return;

            tile.className = 'tile tile-floor';
            tile.style.backgroundImage = 'url("./assets/blocks/block_floor.jpg")';
        };

        const destroyBoxCallback = (x, y) => {
            if (this.claimedPowerUps.has(`${x},${y}`)) return;
            spawnPowerUp(this.world, x, y, this.container, TILE_SIZE);
        };

        const onPlayerHurt = (entity, id, remainingLives) => {
            if (entity === this.localPlayerEntity) {
                setLives(remainingLives);
            }
        };

        const onPowerUpPicked = (id, type, x, y) => {
            this.claimedPowerUps.add(`${x},${y}`);

            if (this.localPlayerEntity === null) return;

            const player = this.world.getComponent(this.localPlayerEntity, 'Player');
            if (player && player.id === id) {
                this.updateHudStats(this.localPlayerEntity);
            }

            if (this.socket && this.socket.readyState === WebSocket.OPEN) {
                this.socket.send(JSON.stringify({
                    type: 'POWERUP_PICKED',
                    payload: { id, type, x, y }
                }));
            }
        };

        this.world.broadcastMovement = (entity, x, y, gridX, gridY, direction, isMoving) => {
            const player = this.world.getComponent(entity, 'Player');
            if (!player || !this.socket || this.socket.readyState !== WebSocket.OPEN) return;

            this.socket.send(JSON.stringify({
                type: 'MOVE_STATE',
                payload: {
                    id: player.id,
                    x,
                    y,
                    gridX,
                    gridY,
                    direction,
                    isMoving,
                    state: isMoving ? 'RUN' : 'IDLE',
                }
            }));
        };

        this.world.addSystem((w, dt, now) => movementSystem(w, dt, now, this.mapData, TILE_SIZE));
        this.world.addSystem((w, dt, now) => bombSystem(w, dt, now, this.mapData, updateMapCell, destroyBoxCallback, TILE_SIZE));
        this.world.addSystem((w, dt, now) => damageSystem(w, now, onPlayerHurt, TILE_SIZE));
        this.world.addSystem((w, dt, now) => powerUpSystem(w, onPowerUpPicked));
        this.world.addSystem((w, dt, now) => renderSystem(w, dt, now, ANIMATION_ROWS));
    }

    gameLoop(now) {
        if (!this.running) return;

        const dt = now - this.lastTime;
        this.lastTime = now;
        this.world.update(dt, now);
        
        // Check for extra life collision with players
        checkExtraLifeCollision(this.world, TILE_SIZE);
        
        // Check for game end conditions (win/loss)
        checkGameEndConditions(this.world, this.localPlayerEntity, this.playerEntities, this.totalPlayers);
        
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
