import { setBombs, setLives, setRange, setSpeed } from '../../pages/game';

export function updateHudStats(entity) {
    const player = this.world.getComponent(entity, 'Player');
    const velocity = this.world.getComponent(entity, 'Velocity');
    if (!player || !velocity) return;

    setBombs(player.maxBombs || 1);
    setLives(player.lives ?? 3);
    setRange(player.bombRange || 4);
    setSpeed(Math.round(velocity.speed));
}
