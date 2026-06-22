import { setLives } from '../../pages/game';

export function powerUpSystem(world, onPowerUpPicked) {
    const players = world.query('Position', 'Velocity', 'Player');
    const powerUps = world.query('Position', 'PowerUp');

    for (const playerEntity of players) {
        const pPos = world.getComponent(playerEntity, 'Position');
        const vel = world.getComponent(playerEntity, 'Velocity');
        const player = world.getComponent(playerEntity, 'Player');
        if (!pPos || !vel || !player) continue;

        // ONLY local player handles collision to avoid multi-pickup bugs
        if (!player.isLocal) continue;

        for (const pUpEntity of powerUps) {
            const upPos = world.getComponent(pUpEntity, 'Position');
            const pUp = world.getComponent(pUpEntity, 'PowerUp');
            if (!upPos || !pUp || pUp.pickedUp) continue;

            // Grid-based collision: player grid position matches power-up grid position
            if (pPos.gridX === upPos.gridX && pPos.gridY === upPos.gridY) {
                pUp.pickedUp = true;

                if (pUp.type === 'HEART') {
                    // 2. Increment the player's lives
                    player.lives += 1;
                    
                    // 3. Update the UI lives counter immediately on the screen
                    setLives(player.lives);
                }

                // 1. Remove the specific Heart DOM element from the screen immediately
                if (pUp.el && pUp.el.parentNode) {
                    pUp.el.parentNode.removeChild(pUp.el);
                }

                // Notify game.js via callback for any server sync needed
                if (onPowerUpPicked) {
                    onPowerUpPicked(player.id, pUp.type, upPos.gridX, upPos.gridY);
                }

                // 4. Remove the heart from the active game state so it cannot be triggered twice
                world.destroyEntity(pUpEntity);
                break;
            }
        }
    }
}
