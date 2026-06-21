const TILE_SIZE = 48;
const STARTING_LIVES = 3;
const BOMB_TIMER = 2000;
const INVINCIBLE_TIME = 1500;
const MAX_SPEED = 8;
const MOVE_TOLERANCE = 140;

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

export function acceptMovement(state, payload, map) {
    if (!state || !state.alive || !payload) return false;

    const x = Number(payload.x);
    const y = Number(payload.y);
    const gridX = Number(payload.gridX);
    const gridY = Number(payload.gridY);

    if (![x, y, gridX, gridY].every(Number.isFinite)) return false;
    if (!canStandOn(map, gridX, gridY)) return false;

    const now = Date.now();
    const elapsed = Math.max(now - state.lastMoveAt, 16);
    const maxDistance = (MAX_SPEED * elapsed / 16.67) + MOVE_TOLERANCE;
    const distance = Math.hypot(x - state.x, y - state.y);

    if (distance > maxDistance) {
        state.lastMoveAt = now;
        return false;
    }

    state.x = x;
    state.y = y;
    state.gridX = gridX;
    state.gridY = gridY;
    state.direction = sanitizeDirection(payload.direction, state.direction);
    state.isMoving = Boolean(payload.isMoving);
    state.lastMoveAt = now;

    return true;
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

function sanitizeDirection(direction, fallback) {
    return ["up", "down", "left", "right"].includes(direction) ? direction : fallback;
}

function unit(seed) {
    const value = Math.sin(seed) * 10000;
    return value - Math.floor(value);
}
