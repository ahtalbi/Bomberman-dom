/**
 * Handles player death transition when lives reach 0.
 * Removes the player's DOM element and spawns an extra-life drop at the death location.
 * 
 * @param {World} world - The game world instance
 * @param {number} playerEntity - The entity ID of the dying player
 * @param {number} tileSize - The size of each grid tile (default: 64)
 */
function handlePlayerDeath(world, playerEntity, tileSize = 64) {
    // Get the player's components
    const position = world.getComponent(playerEntity, 'Position');
    const renderable = world.getComponent(playerEntity, 'Renderable');
    const player = world.getComponent(playerEntity, 'Player');
    
    if (!position || !renderable || !player) return;
    
    // Store the grid coordinates where the player died
    const deathGridX = Math.floor((position.x + tileSize / 2) / tileSize);
    const deathGridY = Math.floor((position.y + tileSize / 2) / tileSize);
    
    // 1. Target and remove the player's DOM element
    if (renderable.el && renderable.el.parentNode) {
        renderable.el.parentNode.removeChild(renderable.el);
    }
    
    // 2. Destroy the player entity from the world (removes all components)
    world.destroyEntity(playerEntity);
    
    // 3. Create a new div at the exact death location with heart emoji
    const extraLifeDiv = document.createElement('div');
    extraLifeDiv.className = 'extra-life-drop';
    extraLifeDiv.style.position = 'absolute';
    extraLifeDiv.style.left = `${deathGridX * tileSize}px`;
    extraLifeDiv.style.top = `${deathGridY * tileSize}px`;
    extraLifeDiv.style.width = `${tileSize}px`;
    extraLifeDiv.style.height = `${tileSize}px`;
    extraLifeDiv.style.display = 'flex';
    extraLifeDiv.style.alignItems = 'center';
    extraLifeDiv.style.justifyContent = 'center';
    extraLifeDiv.style.fontSize = '32px';
    extraLifeDiv.style.zIndex = '5';
    extraLifeDiv.style.pointerEvents = 'none';
    extraLifeDiv.textContent = '❤️';
    
    // Append to the game container
    const gameContainer = document.getElementById('game-container');
    if (gameContainer) {
        gameContainer.appendChild(extraLifeDiv);
    }
    
    // Optional: Add a subtle animation
    extraLifeDiv.style.animation = 'pulse 1s ease-in-out infinite';
    
    console.log(`[Player Death] Player ${player.id} died at (${deathGridX}, ${deathGridY}). Extra life dropped.`);
}

/**
 * Creates a Win/Loss pop-up overlay with a message and redirect button.
 * @param {string} title - The title text ("Win" or "Loss")
 * @param {string} message - The message to display
 * @param {string} type - 'win' or 'loss' for styling
 */
function createGameOverPopup(title, message, type = 'loss') {
    // Check if popup already exists to avoid duplicates
    if (document.querySelector('.game-result-popup')) return;
    
    // Create overlay
    const overlay = document.createElement('div');
    overlay.className = 'game-result-popup';
    overlay.classList.add(type);
    
    // Create popup content
    const popup = document.createElement('div');
    popup.className = 'game-result-popup-content';
    
    const titleEl = document.createElement('h1');
    titleEl.textContent = title;
    titleEl.className = 'game-result-title';
    
    const messageEl = document.createElement('p');
    messageEl.textContent = message;
    messageEl.className = 'game-result-message';
    
    const button = document.createElement('button');
    button.textContent = 'Return to Home';
    button.className = 'game-result-button';
    button.addEventListener('click', () => {
        window.location.href = '/';
    });
    
    popup.appendChild(titleEl);
    popup.appendChild(messageEl);
    popup.appendChild(button);
    overlay.appendChild(popup);
    
    document.body.appendChild(overlay);
}

/**
 * Checks for player deaths and game end conditions.
 * Shows Loss pop-up for eliminated players and Win pop-up for the last survivor.
 * 
 * @param {World} world - The game world instance
 * @param {number} localPlayerEntity - The local player's entity ID
 * @param {Map} playerEntities - Map of player IDs to entity IDs
 * @param {number} totalPlayers - Total number of players at game start
 */
export function checkGameEndConditions(world, localPlayerEntity, playerEntities, totalPlayers) {
    // Count active players (players with lives > 0)
    const allPlayers = world.query('Position', 'Player');
    let activePlayerCount = 0;
    let lastActivePlayerEntity = null;
    
    for (const playerEntity of allPlayers) {
        const player = world.getComponent(playerEntity, 'Player');
        if (player && (player.lives ?? 0) > 0) {
            activePlayerCount++;
            lastActivePlayerEntity = playerEntity;
        }
    }
    
    // Check if local player is eliminated
    if (localPlayerEntity !== null) {
        const localPlayer = world.getComponent(localPlayerEntity, 'Player');
        if (localPlayer && (localPlayer.lives ?? 0) <= 0) {
            // Check if already showed loss popup
            if (!document.querySelector('.game-result-popup.game-result-popup-loss')) {
                createGameOverPopup(
                    'LOSS',
                    'You have been eliminated. Better luck next time!',
                    'loss'
                );
            }
        }
    }
    
    // Check win condition: only 1 player remains (and total was more than 1)
    if (activePlayerCount === 1 && totalPlayers > 1 && lastActivePlayerEntity !== null) {
        const lastPlayer = world.getComponent(lastActivePlayerEntity, 'Player');
        if (lastPlayer) {
            // Check if this is the local player
            if (localPlayerEntity !== null && lastActivePlayerEntity === localPlayerEntity) {
                if (!document.querySelector('.game-result-popup.game-result-popup-win')) {
                    createGameOverPopup(
                        'VICTORY!',
                        'Congratulations! You are the last one standing!',
                        'win'
                    );
                }
            }
        }
    }
}

/**
 * Checks for collision between players and extra-life-drop DOM elements.
 * When a player collides with an extra-life-drop, they gain +1 life and the drop is removed.
 * Only the first player to touch it gets the life.
 * 
 * @param {World} world - The game world instance
 * @param {number} tileSize - The size of each grid tile (default: 64)
 */
export function checkExtraLifeCollision(world, tileSize = 64) {
    // Find all extra-life-drop elements in the DOM
    const extraLifeDrops = document.querySelectorAll('.extra-life-drop');
    if (extraLifeDrops.length === 0) return;
    
    // Get all active players with Position and Player components
    const players = world.query('Position', 'Player');
    if (players.length === 0) return;
    
    for (const drop of extraLifeDrops) {
        // Parse the grid position from the drop's CSS left/top properties
        const dropLeft = parseInt(drop.style.left, 10);
        const dropTop = parseInt(drop.style.top, 10);
        
        if (isNaN(dropLeft) || isNaN(dropTop)) continue;
        
        const dropGridX = Math.round(dropLeft / tileSize);
        const dropGridY = Math.round(dropTop / tileSize);
        
        for (const playerEntity of players) {
            const pPos = world.getComponent(playerEntity, 'Position');
            const player = world.getComponent(playerEntity, 'Player');
            
            if (!pPos || !player) continue;
            
            // Calculate player's current grid position
            const playerGridX = Math.floor((pPos.x + tileSize / 2) / tileSize);
            const playerGridY = Math.floor((pPos.y + tileSize / 2) / tileSize);
            
            // Check for collision (same grid cell)
            if (playerGridX === dropGridX && playerGridY === dropGridY) {
                // Increase player's lives by +1
                player.lives = (player.lives ?? 0) + 1;
                
                // Remove the extra-life-drop from DOM
                if (drop.parentNode) {
                    drop.parentNode.removeChild(drop);
                }
                
                console.log(`[Extra Life] Player ${player.id} picked up an extra life! Lives: ${player.lives}`);
                
                // Break out of the inner loop since this drop is now gone
                break;
            }
        }
    }
}

export function damageSystem(world, now, onPlayerHurt, tileSize = 64) {
    const players = world.query('Position', 'Player');
    const explosions = world.query('Position', 'Explosion');
    
    for (const playerEntity of players) {
        const pPos = world.getComponent(playerEntity, 'Position');
        const player = world.getComponent(playerEntity, 'Player');
        
        if (player.invincibleUntil && player.invincibleUntil > now) continue;
        
        for (const expEntity of explosions) {
            const ePos = world.getComponent(expEntity, 'Position');
            
            //(Grid-based collision)
            const playerGridX = Math.floor((pPos.x + tileSize / 2) / tileSize);
            const playerGridY = Math.floor((pPos.y + tileSize / 2) / tileSize);

            if (playerGridX === ePos.gridX && playerGridY === ePos.gridY) {
                const previousLives = player.lives ?? 3;
                player.lives = Math.max(previousLives - 1, 0);
                player.invincibleUntil = now + 1500;
                
                // Handle death when lives reach 0
                if (player.lives <= 0) {
                    handlePlayerDeath(world, playerEntity, tileSize);
                }
                
                if (onPlayerHurt) {
                    onPlayerHurt(playerEntity, player.id, player.lives);
                }
                
                break;
            }
        }
    }
}
