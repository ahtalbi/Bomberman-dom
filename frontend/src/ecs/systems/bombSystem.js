export function bombSystem(world, dt, now, mapData, updateMapCell, destroyBoxCallback, tileSize = 64) {
    const bombs = world.query('Position', 'Bomb');
    
    for (const bombEntity of bombs) {
        const pos = world.getComponent(bombEntity, 'Position');
        const bomb = world.getComponent(bombEntity, 'Bomb');
        
        bomb.timer -= dt;
        
        if (bomb.timer <= 0 && !bomb.exploded) {
            bomb.exploded = true;
            
            const affectedCells = calculateExplosionCells(pos.gridX, pos.gridY, bomb.range, mapData);
            
            affectedCells.forEach(cell => {
                const expEntity = world.createEntity();
                const expDiv = document.createElement('div');
                expDiv.className = 'explosion';
                expDiv.style.position = 'absolute';
                expDiv.style.width = `${tileSize}px`;
                expDiv.style.height = `${tileSize}px`;
                expDiv.style.left = `${cell.x * tileSize}px`;
                expDiv.style.top = `${cell.y * tileSize}px`;
                expDiv.style.zIndex = '7';

                world.addComponent(expEntity, 'Position', { 
                    gridX: cell.x, 
                    gridY: cell.y, 
                    x: cell.x * tileSize, 
                    y: cell.y * tileSize 
                });
                world.addComponent(expEntity, 'Explosion', { duration: 500, el: expDiv });
                bomb.el.parentNode.appendChild(expDiv);
                
                if (mapData[cell.y] && mapData[cell.y][cell.x] === 4) {
                    updateMapCell(cell.x, cell.y, 2);
                    
                    if (destroyBoxCallback) {
                        destroyBoxCallback(cell.x, cell.y);
                    }
                }
            });
            
            if (bomb.el && bomb.el.parentNode) {
                bomb.el.parentNode.removeChild(bomb.el);
            }
            world.destroyEntity(bombEntity);
        }
    }
    
    const explosions = world.query('Position', 'Explosion');
    for (const expEntity of explosions) {
        const exp = world.getComponent(expEntity, 'Explosion');
        exp.duration -= dt;
        
        if (exp.duration <= 0) {
            if (exp.el && exp.el.parentNode) {
                exp.el.parentNode.removeChild(exp.el);
            }
            world.destroyEntity(expEntity);
        }
    }
}

function calculateExplosionCells(bx, by, range, mapData) {
    const cells = [{ x: bx, y: by }];
    const directions = [
        { x: 0, y: -1 },
        { x: 0, y: 1 },
        { x: -1, y: 0 },
        { x: 1, y: 0 }
    ];
    
    const steps = range - 1; 
    
    directions.forEach(dir => {
        for (let i = 1; i <= steps; i++) {
            const tx = bx + (dir.x * i);
            const ty = by + (dir.y * i);
            
            if (!mapData[ty] || mapData[ty][tx] === undefined) break;
            
            const cellType = mapData[ty][tx];
            
            if (cellType === 3) {
                break;
            }
            
            cells.push({ x: tx, y: ty });
            
            if (cellType === 4) {
                break;
            }
        }
    });
    
    return cells;
}
