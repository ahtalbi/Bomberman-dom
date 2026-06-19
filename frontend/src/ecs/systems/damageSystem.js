/**
 * Spawns a HEART power-up entity at the specified grid coordinates.
 * This creates a proper ECS entity with Position, PowerUp, and Renderable components.
 * 
 * @param {World} world - The game world instance
 * @param {number} gridX - Grid X coordinate
 * @param {number} gridY - Grid Y coordinate
 * @param {HTMLElement} container - The game container element
 * @param {number} tileSize - The size of each grid tile (default: 64)
 */
export function spawnHeartPowerUp(world, gridX, gridY, container, tileSize = 64) {
    // Create a new entity for the heart power-up
    const heartEntity = world.createEntity();
    
    // Add Position component
    world.addComponent(heartEntity, 'Position', {
        gridX: gridX,
        gridY: gridY,
        x: gridX * tileSize,
        y: gridY * tileSize
    });
    
    // Add PowerUp component with type 'HEART'
    world.addComponent(heartEntity, 'PowerUp', {
        type: 'HEART',
        pickedUp: false,
        el: null  // Will be set after creating the DOM element
    });
    
    // Create the DOM element for rendering
    const heartDiv = document.createElement('div');
    heartDiv.className = 'powerup powerup-heart';
    heartDiv.style.position = 'absolute';
    heartDiv.style.left = `${gridX * tileSize}px`;
    heartDiv.style.top = `${gridY * tileSize}px`;
    heartDiv.style.width = `${tileSize}px`;
    heartDiv.style.height = `${tileSize}px`;
    heartDiv.style.display = 'flex';
    heartDiv.style.alignItems = 'center';
    heartDiv.style.justifyContent = 'center';
    heartDiv.style.fontSize = '32px';
    heartDiv.style.zIndex = '5';
    heartDiv.textContent = '❤️';
    
    container.appendChild(heartDiv);
    
    // Update the PowerUp component with the DOM element reference
    const powerUp = world.getComponent(heartEntity, 'PowerUp');
    if (powerUp) {
        powerUp.el = heartDiv;
    }
    
    console.log(`[Heart Drop] Spawned HEART power-up at (${gridX}, ${gridY})`);
}

/**
 * Handles player death transition when lives reach 0.
 * Removes the player's DOM element and spawns a HEART power-up entity at the death location.
 * 
 * @param {World} world - The game world instance
 * @param {number} playerEntity - The entity ID of the dying player
 * @param {number} tileSize - The size of each grid tile (default: 64)
 * @param {HTMLElement} container - The game container element
 */
function handlePlayerDeath(world, playerEntity, tileSize = 64, container = null) {
    // Get the player's components
    const position = world.getComponent(playerEntity, 'Position');
    const renderable = world.getComponent(playerEntity, 'Renderable');
    const player = world.getComponent(playerEntity, 'Player');
    
    if (!position || !renderable || !player) return;
    
    // Store the grid coordinates where the player died
    const deathGridX = Math.floor((position.x + tileSize / 2) / tileSize);
    const deathGridY = Math.floor((position.y + tileSize / 2) / tileSize);
    
    // 1. Instead of destroying the entity, remove components that enable interaction and rendering.
    // This effectively turns the player into a non-interactive "ghost" or spectator.
    world.removeComponent(playerEntity, 'Renderable'); // This will stop it from being drawn
    world.removeComponent(playerEntity, 'Velocity');
    world.removeComponent(playerEntity, 'Input');
    // We keep Position and Player components to know where they are and who they are.
    
    // 2. Spawn a HEART power-up entity at the death location (proper ECS entity)
    const gameContainer = container || document.getElementById('game-container');
    if (gameContainer) {
        spawnHeartPowerUp(world, deathGridX, deathGridY, gameContainer, tileSize);
    }
    
    console.log(`[Player Death] Player ${player.id} died at (${deathGridX}, ${deathGridY}). Heart power-up dropped.`);
}

export function damageSystem(world, now, onPlayerHurt, localPlayerEntity, tileSize = 64, socket) {
    const players = world.query('Position', 'Player');
    const explosions = world.query('Position', 'Explosion');
    
    for (const playerEntity of players) {
        const pPos = world.getComponent(playerEntity, 'Position');
        const player = world.getComponent(playerEntity, 'Player');
        
        if (player.invincibleUntil && player.invincibleUntil > now) continue;
        
        for (const expEntity of explosions) {
            const ePos = world.getComponent(expEntity, 'Position');
            
            // Grid-based collision
            const playerGridX = Math.floor((pPos.x + tileSize / 2) / tileSize);
            const playerGridY = Math.floor((pPos.y + tileSize / 2) / tileSize);

            if (playerGridX === ePos.gridX && playerGridY === ePos.gridY) {
                const previousLives = player.lives ?? 3;
                player.lives = Math.max(previousLives - 1, 0);
                player.invincibleUntil = now + 1500;
                
                // Always call the callback to update HUD or notify server.
                if (onPlayerHurt) {
                    onPlayerHurt(playerEntity, player.id, player.lives);
                }
                
                // If the player is dead, THEN perform local cleanup.
                // This happens AFTER the server has been notified via the callback.
                if (player.lives <= 0) {
                    handlePlayerDeath(world, playerEntity, tileSize);
                }
                
                // Break the loop since the player has already taken damage from this explosion.
                break;
            }
        }
    }
}