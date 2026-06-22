import { BombComponent } from '../components.js';
import { TILE_SIZE } from '../../pages/game';

export function createBomb(ownerId, gridX, gridY, range, bombId = null) {
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

export function removePowerUpAt(gridX, gridY) {
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

export function updateMapCell(x, y, newValue) {
    if (!this.mapData[y]) return;

    this.mapData[y][x] = newValue;

    const tile = this.container.querySelector(`[data-x="${x}"][data-y="${y}"]`);
    if (!tile) return;

    tile.className = 'tile tile-floor';
    tile.style.backgroundImage = 'url("./assets/blocks/block_floor.jpg")';
}

export function removeBomb(bombId, fallbackCell) {
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

export function createExplosion(gridX, gridY, duration) {
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

export function createPowerUp(gx, gy, type) {
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
