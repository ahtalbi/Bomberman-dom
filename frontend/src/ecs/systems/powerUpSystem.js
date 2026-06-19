export function powerUpSystem(world, onPowerUpPicked) {
    const players = world.query('Position', 'Velocity', 'Player');
    const powerUps = world.query('Position', 'PowerUp');

    for (const playerEntity of players) {
        const pPos = world.getComponent(playerEntity, 'Position');
        const vel = world.getComponent(playerEntity, 'Velocity');
        const player = world.getComponent(playerEntity, 'Player');
        if (!pPos || !vel || !player) continue;

        for (const pUpEntity of powerUps) {
            const upPos = world.getComponent(pUpEntity, 'Position');
            const pUp = world.getComponent(pUpEntity, 'PowerUp');
            if (!upPos || !pUp || pUp.pickedUp) continue;

            // Grid-based collision: player grid position matches power-up grid position
            if (pPos.gridX === upPos.gridX && pPos.gridY === upPos.gridY) {
                pUp.pickedUp = true;

                // Handle different power-up types
                if (pUp.type === 'SPEED') {
                    vel.speed = Math.min(vel.speed + 1, 8);
                }
                else if (pUp.type === 'BOMBS') {
                    player.maxBombs = player.maxBombs ? player.maxBombs + 1 : 2;
                }
                else if (pUp.type === 'FLAME') {
                    player.bombRange = player.bombRange ? player.bombRange + 1 : 5;
                }
                else if (pUp.type === 'HEART') {
                    player.lives += 1;
                }

                // Remove the power-up's DOM element from the screen
                if (pUp.el && pUp.el.parentNode) {
                    pUp.el.parentNode.removeChild(pUp.el);
                }

                // Notify game.js via callback (handles HUD update + server sync)
                // CRITICAL: This triggers updateHudStats, NOT onPlayerHurt
                if (onPowerUpPicked) {
                    onPowerUpPicked(player.id, pUp.type, upPos.gridX, upPos.gridY);
                }

                // Destroy the power-up entity from the world immediately
                world.destroyEntity(pUpEntity);
                console.log(`[HEART DESTROYED] Heart entity removed from world at (${upPos.gridX}, ${upPos.gridY})`);
                break;
            }
        }
    }
}

export function spawnPowerUp(world, gx, gy, container, tileSize = 64) {
    const seed = gx * 73856093 ^ gy * 19349663;
    const seedRandom = (Math.sin(seed) * 10000) - Math.floor(Math.sin(seed) * 10000);
    
    if (seedRandom > 0.35) return;

    const types = ['SPEED', 'BOMBS', 'FLAME'];
    const typeIndex = Math.floor((Math.sin(seed * 2) * 10000 - Math.floor(Math.sin(seed * 2) * 10000)) * types.length);
    const randomType = types[typeIndex];

    const pUpEntity = world.createEntity();
    world.addComponent(pUpEntity, 'Position', { gridX: gx, gridY: gy, x: gx * tileSize, y: gy * tileSize });
    
    const div = document.createElement('div');
    div.className = `powerup powerup-${randomType.toLowerCase()}`;
    div.style.position = 'absolute';
    div.style.width = `${tileSize}px`;
    div.style.height = `${tileSize}px`;
    div.style.left = `${gx * tileSize}px`;
    div.style.top = `${gy * tileSize}px`;
    div.style.zIndex = '5';
    container.appendChild(div);

    world.addComponent(pUpEntity, 'PowerUp', { type: randomType, el: div });
}
