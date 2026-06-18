export function movementSystem(world, dt, now, mapData, tileSize = 40) {
    const entities = world.query('Position', 'Velocity');
    const delta = dt / 16.67;

    const PLAYER_SIZE = tileSize;

    for (const entity of entities) {
        const pos = world.getComponent(entity, 'Position');
        const vel = world.getComponent(entity, 'Velocity');
        const input = world.getComponent(entity, 'Input');
        const behavior = world.getComponent(entity, 'Behavior');

        if (behavior) {
            vel.speed = vel.baseSpeed + (behavior.fastShoesLevel - 1) * 0.5;
        } else {
            vel.speed = vel.baseSpeed;
        }

        if (!input) {
            moveTowardTarget(pos, vel, delta);
            continue;
        }

        const activeInput = input.inputQueue[0];
        let dx = 0;
        let dy = 0;

        if (activeInput === 'up') {
            dy = -1;
            vel.direction = 'up';
        } else if (activeInput === 'down') {
            dy = 1;
            vel.direction = 'down';
        } else if (activeInput === 'left') {
            dx = -1;
            vel.direction = 'left';
        } else if (activeInput === 'right') {
            dx = 1;
            vel.direction = 'right';
        }

        const hasInput = dx !== 0 || dy !== 0;

        if (!hasInput) {
            pos.targetX = pos.x;
            pos.targetY = pos.y;
            vel.isMoving = false;
            const renderable = world.getComponent(entity, 'Renderable');
            if (renderable) {
                renderable.state = 'IDLE';
            }
            
            pos.gridX = Math.floor(
                (pos.x + PLAYER_SIZE / 2) / tileSize
            );

            pos.gridY = Math.floor(
                (pos.y + PLAYER_SIZE / 2) / tileSize
            );

            if (world.broadcastMovement) {
                world.broadcastMovement(
                    entity,
                    pos.x,
                    pos.y,
                    pos.gridX,
                    pos.gridY,
                    vel.direction,
                    vel.isMoving
                );
            }
            continue;
        }

        const prevX = pos.x;
        const prevY = pos.y;

        const nextX = pos.x + dx * vel.speed * delta;
        const nextY = pos.y + dy * vel.speed * delta;

        const snapThreshold = 32;

        if (dy !== 0 && dx === 0) {
            if (isBlocked(pos.x, nextY, mapData, tileSize, PLAYER_SIZE)) {
                const currentTileX = Math.floor((pos.x + PLAYER_SIZE / 2) / tileSize);
                const targetX = currentTileX * tileSize;
                const diffX = pos.x - targetX;

                if (Math.abs(diffX) < snapThreshold) {
                    dy = 0;
                    dx = -Math.sign(diffX);
                }
            }
        }

        if (dx !== 0 && dy === 0) {
            if (isBlocked(nextX, pos.y, mapData, tileSize, PLAYER_SIZE)) {
                const currentTileY = Math.floor((pos.y + PLAYER_SIZE / 2) / tileSize);
                const targetY = currentTileY * tileSize;
                const diffY = pos.y - targetY;

                if (Math.abs(diffY) < snapThreshold) {
                    dx = 0;
                    dy = -Math.sign(diffY);
                }
            }
        }

        const nextXAfterSnap = pos.x + dx * vel.speed * delta;
        const nextYAfterSnap = pos.y + dy * vel.speed * delta;

        if (dx !== 0 && !isBlocked(nextXAfterSnap, pos.y, mapData, tileSize, PLAYER_SIZE)) {
            pos.x = nextXAfterSnap;
        }

        if (dy !== 0 && !isBlocked(pos.x, nextYAfterSnap, mapData, tileSize, PLAYER_SIZE)) {
            pos.y = nextYAfterSnap;
        }

        vel.isMoving = pos.x !== prevX || pos.y !== prevY;

        const renderable = world.getComponent(entity, 'Renderable');
        if (renderable) {
            renderable.state = vel.isMoving ? 'RUN' : 'IDLE';
        }

        pos.gridX = Math.floor(
            (pos.x + PLAYER_SIZE / 2) / tileSize
        );

        pos.gridY = Math.floor(
            (pos.y + PLAYER_SIZE / 2) / tileSize
        );

        pos.targetX = pos.x;
        pos.targetY = pos.y;

        if (world.broadcastMovement) {
            world.broadcastMovement(
                entity,
                pos.x,
                pos.y,
                pos.gridX,
                pos.gridY,
                vel.direction,
                vel.isMoving
            );
        }
    }
}

function moveTowardTarget(pos, vel, delta) {
    const step = vel.speed * delta;

    if (pos.x < pos.targetX) {
        pos.x = Math.min(pos.x + step, pos.targetX);
    } else if (pos.x > pos.targetX) {
        pos.x = Math.max(pos.x - step, pos.targetX);
    }

    if (pos.y < pos.targetY) {
        pos.y = Math.min(pos.y + step, pos.targetY);
    } else if (pos.y > pos.targetY) {
        pos.y = Math.max(pos.y - step, pos.targetY);
    }

    vel.isMoving =
        pos.x !== pos.targetX ||
        pos.y !== pos.targetY;
}

function isBlocked(x, y, mapData, tileSize, playerSize = tileSize) {
    const padding = 4;

    const left = Math.floor(
        (x + padding) / tileSize
    );

    const right = Math.floor(
        (x + playerSize - padding) / tileSize
    );

    const top = Math.floor(
        (y + padding) / tileSize
    );

    const bottom = Math.floor(
        (y + playerSize - padding) / tileSize
    );

    return (
        isBlockedCell(left, top, mapData) ||
        isBlockedCell(right, top, mapData) ||
        isBlockedCell(left, bottom, mapData) ||
        isBlockedCell(right, bottom, mapData)
    );
}

function isBlockedCell(x, y, mapData) {
    const cell = mapData[y] && mapData[y][x];

    return cell !== 0 && cell !== 2;
}