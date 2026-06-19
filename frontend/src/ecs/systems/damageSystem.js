/**
 * Creates a Loss pop-up modal for the eliminated player.
 * @param {string} playerName - The name of the eliminated player
 */
function showLossPopup(playerName) {
    // Check if popup already exists to avoid duplicates
    if (document.querySelector('.game-result-popup')) return;
    
    // Create overlay
    const overlay = document.createElement('div');
    overlay.className = 'game-result-popup loss';
    
    // Create popup content
    const popup = document.createElement('div');
    popup.className = 'game-result-popup-content';
    
    const titleEl = document.createElement('h1');
    titleEl.textContent = 'YOU LOST';
    titleEl.className = 'game-result-title';
    
    const messageEl = document.createElement('p');
    messageEl.textContent = `${playerName}, you have been eliminated!`;
    messageEl.className = 'game-result-message';
    
    const button = document.createElement('button');
    button.textContent = 'Reload Page';
    button.className = 'game-result-button';
    button.addEventListener('click', () => {
        window.location.reload();
    });
    
    popup.appendChild(titleEl);
    popup.appendChild(messageEl);
    popup.appendChild(button);
    overlay.appendChild(popup);
    
    document.body.appendChild(overlay);
}

/**
 * Creates a Win pop-up modal for the victorious player.
 * @param {string} playerName - The name of the winning player
 */
function showWinPopup(playerName) {
    // Check if popup already exists to avoid duplicates
    if (document.querySelector('.game-result-popup')) return;
    
    // Create overlay
    const overlay = document.createElement('div');
    overlay.className = 'game-result-popup win';
    
    // Create popup content
    const popup = document.createElement('div');
    popup.className = 'game-result-popup-content';
    
    const titleEl = document.createElement('h1');
    titleEl.textContent = 'YOU WON!';
    titleEl.className = 'game-result-title';
    
    const messageEl = document.createElement('p');
    messageEl.textContent = `Congratulations ${playerName}, you are the last one standing!`;
    messageEl.className = 'game-result-message';
    
    const button = document.createElement('button');
    button.textContent = 'Reload Page';
    button.className = 'game-result-button';
    button.addEventListener('click', () => {
        window.location.reload();
    });
    
    popup.appendChild(titleEl);
    popup.appendChild(messageEl);
    popup.appendChild(button);
    overlay.appendChild(popup);
    
    document.body.appendChild(overlay);
}

/**
 * Handles player death transition when lives reach 0.
 * Removes the player's DOM element and spawns an extra-life drop at the death location.
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
    
    // 1. Remove the player's DOM element entirely
    if (renderable.el && renderable.el.parentNode) {
        renderable.el.parentNode.removeChild(renderable.el);
    }
    
    // 2. Destroy the player entity from the world (removes all components)
    world.destroyEntity(playerEntity);
    
    // 3. Create an img element at the exact death location with heart image
    const heartImg = document.createElement('img');
    heartImg.className = 'extra-life-drop';
    heartImg.src = '../../assets/images/hearts.png'; // Path to heart image (adjust as needed)
    heartImg.style.position = 'absolute';
    heartImg.style.left = `${deathGridX * tileSize}px`;
    heartImg.style.top = `${deathGridY * tileSize}px`;
    heartImg.style.width = `${tileSize}px`;
    heartImg.style.height = `${tileSize}px`;
    heartImg.style.zIndex = '5';
    heartImg.style.objectFit = 'contain';
    heartImg.style.animation = 'pulse 1s ease-in-out infinite';
    
    // Append to the game container
    const gameContainer = container || document.getElementById('game-container');
    if (gameContainer) {
        gameContainer.appendChild(heartImg);
    }
    
    console.log(`[Player Death] Player ${player.id} died at (${deathGridX}, ${deathGridY}). Heart dropped.`);
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
            if (!document.querySelector('.game-result-popup')) {
                showLossPopup(localPlayer.id || 'Player');
            }
        }
    }
    
    // Check win condition: EXACTLY 1 active player remains on the board
    if (activePlayerCount === 1 && totalPlayers > 1 && lastActivePlayerEntity !== null) {
        const lastPlayer = world.getComponent(lastActivePlayerEntity, 'Player');
        if (lastPlayer) {
            // Check if this is the local player
            if (localPlayerEntity !== null && lastActivePlayerEntity === localPlayerEntity) {
                if (!document.querySelector('.game-result-popup')) {
                    showWinPopup(lastPlayer.id || 'Player');
                }
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
