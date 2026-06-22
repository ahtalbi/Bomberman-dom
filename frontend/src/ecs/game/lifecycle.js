import {
    PositionComponent,
    VelocityComponent,
    InputComponent,
    RenderableComponent,
    PlayerComponent
} from '../components.js';
import { renderSystem } from '../systems/renderSystem.js';
import { TILE_SIZE } from '../../pages/game';
import { ANIMATION_ROWS, SPRITE_COLUMNS, SPRITE_ROWS } from './constants.js';

export function init(localPlayerId, allPlayers) {
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

export function registerSystems() {
    this.world.addSystem((w, dt, now) => renderSystem(w, dt, now, ANIMATION_ROWS));
}

export function gameLoop(now) {
    if (!this.running) return;

    const dt = now - this.lastTime;
    this.lastTime = now;
    this.world.update(dt, now);
    if (this.localPlayerEntity !== null) {
        this.updateHudStats(this.localPlayerEntity);
    }
    this.animationFrame = requestAnimationFrame((nextNow) => this.gameLoop(nextNow));
}

export function destroy() {
    this.running = false;

    if (this.animationFrame) {
        cancelAnimationFrame(this.animationFrame);
    }

    if (this.removeInputListeners) {
        this.removeInputListeners();
    }
}
