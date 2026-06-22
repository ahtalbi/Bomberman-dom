import { World } from './world.js';
import { init, registerSystems, gameLoop, destroy } from './game/lifecycle.js';
import { setupInput, sendInput, dropBomb } from './game/input.js';
import { createBomb, removePowerUpAt, updateMapCell, removeBomb, createExplosion, createPowerUp } from './game/entities.js';
import {
    handleRemoteMove,
    handleRemoteBomb,
    handleRemotePowerUpPicked,
    applyServerStats,
    handlePlayerDamaged,
    handleGameOver,
    handleExplosionChecked
} from './game/remoteHandlers.js';
import { updateHudStats } from './game/hud.js';

export { setPlayerName, getPlayerName } from './game/playerName.js';

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

    init = init;
    setupInput = setupInput;
    sendInput = sendInput;
    dropBomb = dropBomb;
    createBomb = createBomb;
    handleRemoteMove = handleRemoteMove;
    handleRemoteBomb = handleRemoteBomb;
    handleRemotePowerUpPicked = handleRemotePowerUpPicked;
    removePowerUpAt = removePowerUpAt;
    applyServerStats = applyServerStats;
    handlePlayerDamaged = handlePlayerDamaged;
    handleGameOver = handleGameOver;
    handleExplosionChecked = handleExplosionChecked;
    updateMapCell = updateMapCell;
    removeBomb = removeBomb;
    createExplosion = createExplosion;
    createPowerUp = createPowerUp;
    registerSystems = registerSystems;
    gameLoop = gameLoop;
    destroy = destroy;
    updateHudStats = updateHudStats;
}
