const TILE_SIZE = 48;
const STARTING_LIVES = 3;
const BOMB_TIMER = 2000;
const INVINCIBLE_TIME = 1500;
const PLAYER_SIZE = TILE_SIZE;
const MAX_SPEED = 8;
const INPUT_RATE = 30;
const INPUT_BURST = 8;
const INPUT_MUTE_TIME = 1000;
const SNAP_THRESHOLD = 32;

export function createPlayerState(player, start, color) {
    return {
        id: player.id,
        nickname: player.nickname,
        color,
        x: start.x * TILE_SIZE,
        y: start.y * TILE_SIZE,
        gridX: start.x,
        gridY: start.y,
        direction: "down",
        isMoving: false,
        lives: STARTING_LIVES,
        alive: true,
        invincibleUntil: 0,
        maxBombs: 1,
        activeBombs: 0,
        bombRange: 2,
        speed: 2.5,
        lastMoveAt: Date.now(),
        inputDirection: null,
        inputTokens: INPUT_BURST,
        lastInputAt: 0,
        inputMutedUntil: 0,
    };
}

export function publicPlayer(state) {
    return {
        id: state.id,
        nickname: state.nickname,
        color: state.color,
        x: state.gridX,
        y: state.gridY,
        lives: state.lives,
        maxBombs: state.maxBombs,
        bombRange: state.bombRange,
        alive: state.alive,
    };
}

export function publicMove(state, corrected = false) {
    return {
        id: state.id,
        x: state.x,
        y: state.y,
        gridX: state.gridX,
        gridY: state.gridY,
        direction: state.direction,
        isMoving: state.isMoving,
        state: state.isMoving ? "RUN" : "IDLE",
        corrected,
    };
}

export function publicStats(state) {
    return {
        lives: state.lives,
        alive: state.alive,
        maxBombs: state.maxBombs,
        bombRange: state.bombRange,
        speed: state.speed,
    };
}

export function canReadInput(state) {
    const now = Date.now();
    if (state.inputMutedUntil > now) return false;

    const elapsed = Math.max(now - state.lastInputAt, 0);
    state.lastInputAt = now;
    state.inputTokens = Math.min(
        INPUT_BURST,
        state.inputTokens + (elapsed / 1000) * INPUT_RATE
    );

    if (state.inputTokens < 1) {
        state.inputMutedUntil = now + INPUT_MUTE_TIME;
        return false;
    }

    state.inputTokens -= 1;
    return true;
}

export function updatePlayerInput(state, payload) {
    if (!state || !state.alive || !payload) return false;

    const direction = sanitizeDirection(payload.direction, null);
    const nextDirection = payload.isMoving && direction ? direction : null;

    if (state.inputDirection === nextDirection) return false;

    state.inputDirection = nextDirection;
    return true;
}

export function updateMovement(state, map, dt) {
    if (!state || !state.alive) return false;

    const previous = {
        x: state.x,
        y: state.y,
        gridX: state.gridX,
        gridY: state.gridY,
        direction: state.direction,
        isMoving: state.isMoving,
    };

    let dx = 0;
    let dy = 0;

    if (state.inputDirection === "up") dy = -1;
    if (state.inputDirection === "down") dy = 1;
    if (state.inputDirection === "left") dx = -1;
    if (state.inputDirection === "right") dx = 1;

    state.isMoving = dx !== 0 || dy !== 0;

    if (state.isMoving) {
        state.direction = state.inputDirection;
    }

    const delta = Math.min(dt, 50) / 16.67;
    const speed = Math.min(state.speed, MAX_SPEED);

    const nextX = state.x + dx * speed * delta;
    const nextY = state.y + dy * speed * delta;

    if (dy !== 0 && dx === 0) {
        if (isBlocked(state.x, nextY, map)) {
            const currentTileX = Math.floor((state.x + PLAYER_SIZE / 2) / TILE_SIZE);
            const targetX = currentTileX * TILE_SIZE;
            const diffX = state.x - targetX;

            if (Math.abs(diffX) < SNAP_THRESHOLD) {
                dy = 0;
                dx = -Math.sign(diffX);
            }
        }
    }

    if (dx !== 0 && dy === 0) {
        if (isBlocked(nextX, state.y, map)) {
            const currentTileY = Math.floor((state.y + PLAYER_SIZE / 2) / TILE_SIZE);
            const targetY = currentTileY * TILE_SIZE;
            const diffY = state.y - targetY;

            if (Math.abs(diffY) < SNAP_THRESHOLD) {
                dx = 0;
                dy = -Math.sign(diffY);
            }
        }
    }

    const nextXAfterSnap = state.x + dx * speed * delta;
    const nextYAfterSnap = state.y + dy * speed * delta;

    if (dx !== 0 && !isBlocked(nextXAfterSnap, state.y, map)) {
        state.x = nextXAfterSnap;
    }

    if (dy !== 0 && !isBlocked(state.x, nextYAfterSnap, map)) {
        state.y = nextYAfterSnap;
    }

    state.gridX = Math.floor((state.x + PLAYER_SIZE / 2) / TILE_SIZE);
    state.gridY = Math.floor((state.y + PLAYER_SIZE / 2) / TILE_SIZE);
    state.lastMoveAt = Date.now();

    return (
        Math.abs(previous.x - state.x) > 0.1 ||
        Math.abs(previous.y - state.y) > 0.1 ||
        previous.gridX !== state.gridX ||
        previous.gridY !== state.gridY ||
        previous.direction !== state.direction ||
        previous.isMoving !== state.isMoving
    );
}

export function applyPowerUp(state, type) {
    if (!state || !state.alive) return;

    if (type === "BOMBS") {
        state.maxBombs += 1;
    } else if (type === "FLAME") {
        state.bombRange += 1;
    } else if (type === "SPEED") {
        state.speed = Math.min(state.speed + 1, MAX_SPEED);
    }
}

export function calculateExplosionCells(bx, by, range, map) {
    const cells = [{ x: bx, y: by }];
    const dirs = [
        { x: 0, y: -1 },
        { x: 0, y: 1 },
        { x: -1, y: 0 },
        { x: 1, y: 0 },
    ];

    for (const dir of dirs) {
        for (let i = 1; i <= range - 1; i++) {
            const x = bx + dir.x * i;
            const y = by + dir.y * i;

            if (!map[y] || map[y][x] === undefined) break;
            if (map[y][x] === 3) break;

            cells.push({ x, y });

            if (map[y][x] === 4) break;
        }
    }

    return cells;
}

export function damagePlayers(players, cells) {
    const now = Date.now();
    const damaged = [];

    for (const state of players.values()) {
        if (!state.alive || state.invincibleUntil > now) continue;

        const hit = cells.some(cell => cell.x === state.gridX && cell.y === state.gridY);
        if (!hit) continue;

        state.lives = Math.max(state.lives - 1, 0);
        state.invincibleUntil = now + INVINCIBLE_TIME;

        if (state.lives === 0) {
            state.alive = false;
            state.isMoving = false;
        }

        damaged.push({
            id: state.id,
            lives: state.lives,
            alive: state.alive,
        });
    }

    return damaged;
}

export function powerUpForCell(x, y) {
    const seed = x * 73856093 ^ y * 19349663;
    if (unit(seed) > 0.35) return null;

    const types = ["SPEED", "BOMBS", "FLAME"];
    return types[Math.floor(unit(seed * 2) * types.length)];
}

export function bombDelay() {
    return BOMB_TIMER;
}

export function sameCell(a, b) {
    return a && b && Number(a.x) === Number(b.x) && Number(a.y) === Number(b.y);
}

function canStandOn(map, x, y) {
    const cell = map[y] && map[y][x];
    return cell === 0 || cell === 2;
}

function isBlocked(x, y, map) {
    const padding = 4;
    const left = Math.floor((x + padding) / TILE_SIZE);
    const right = Math.floor((x + PLAYER_SIZE - padding) / TILE_SIZE);
    const top = Math.floor((y + padding) / TILE_SIZE);
    const bottom = Math.floor((y + PLAYER_SIZE - padding) / TILE_SIZE);

    return (
        !canStandOn(map, left, top) ||
        !canStandOn(map, right, top) ||
        !canStandOn(map, left, bottom) ||
        !canStandOn(map, right, bottom)
    );
}

function sanitizeDirection(direction, fallback) {
    return ["up", "down", "left", "right"].includes(direction) ? direction : fallback;
}

function unit(seed) {
    const value = Math.sin(seed) * 10000;
    return value - Math.floor(value);
}
