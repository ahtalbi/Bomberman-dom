import { setLives } from '../../pages/game';

export function handleRemoteMove(payload) {
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

export function handleRemoteBomb(payload) {
    if (!payload || !payload.id) return;
    this.createBomb(payload.id, payload.x, payload.y, payload.range || 2, payload.bombId);
}

export function handleRemotePowerUpPicked(payload) {
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

export function applyServerStats(entity, stats) {
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

export function handlePlayerDamaged(payload) {
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

export function handleGameOver(payload) {
    this.running = false;
    const winnerName = payload && payload.winnerName ? payload.winnerName : "A player";
    setTimeout(() => alert(`${winnerName} wins!`), 50);
}

export function handleExplosionChecked(payload) {
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
