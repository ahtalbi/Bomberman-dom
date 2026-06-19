import { getPlayerName } from '../game.js';

/**
 * Creates a Loss pop-up modal for the eliminated player.
 * Blocks their screen immediately so they cannot spectate.
 * @param {string} playerName - The name of the eliminated player
 */
function showLossPopup(playerName) {
    // Check if popup already exists to avoid duplicates
    if (document.querySelector('.game-result-popup')) return;
    
    // Create overlay with extremely high z-index to block entire screen
    const overlay = document.createElement('div');
    overlay.className = 'game-result-popup loss';
    overlay.style.zIndex = '99999';
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
    overlay.style.display = 'flex';
    overlay.style.alignItems = 'center';
    overlay.style.justifyContent = 'center';
    
    // Create popup content
    const popup = document.createElement('div');
    popup.className = 'game-result-popup-content';
    
    const titleEl = document.createElement('h1');
    titleEl.textContent = 'You are terrible at this! Wach la3b b rjlik?';
    titleEl.className = 'game-result-title';
    titleEl.style.color = '#ff4444';
    titleEl.style.fontSize = '36px';
    titleEl.style.marginBottom = '30px';
    
    const button = document.createElement('button');
    button.textContent = 'Restart';
    button.className = 'game-result-button';
    button.style.padding = '15px 40px';
    button.style.fontSize = '20px';
    button.style.cursor = 'pointer';
    button.addEventListener('click', () => {
        // Force hard reset - send to initial page
        window.location.href = '/';
    });
    
    popup.appendChild(titleEl);
    popup.appendChild(button);
    overlay.appendChild(popup);
    
    // Append to document.body to block the entire screen immediately
    document.body.appendChild(overlay);
}

/**
 * Creates a Win pop-up modal for the victorious player.
 * @param {string} playerName - The name of the winning player
 */
function showWinPopup(playerName) {
    // Check if popup already exists to avoid duplicates
    if (document.querySelector('.game-result-popup')) return;
    
    // Create overlay with extremely high z-index
    const overlay = document.createElement('div');
    overlay.className = 'game-result-popup win';
    overlay.style.zIndex = '99999';
    
    // Create popup content
    const popup = document.createElement('div');
    popup.className = 'game-result-popup-content';
    
    const titleEl = document.createElement('h1');
    titleEl.textContent = `${playerName.toUpperCase()} WON!`;
    titleEl.className = 'game-result-title';
    
    const button = document.createElement('button');
    button.textContent = 'Return to Home';
    button.className = 'game-result-button';
    button.addEventListener('click', () => {
        // MUST remove modal from DOM first to prevent "ghost modal" bug
        overlay.remove();
        // Force hard redirect to ensure clean slate and destroy any leftover DOM elements
        window.location.href = '/';
    });
    
    popup.appendChild(titleEl);
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
    
    // 3. Create a div with heart emoji at the exact death location
    const heartDiv = document.createElement('div');
    heartDiv.className = 'extra-life-drop';
    heartDiv.textContent = '❤️';
    heartDiv.style.position = 'absolute';
    heartDiv.style.left = `${deathGridX * tileSize}px`;
    heartDiv.style.top = `${deathGridY * tileSize}px`;
    heartDiv.style.width = `${tileSize}px`;
    heartDiv.style.height = `${tileSize}px`;
    heartDiv.style.display = 'flex';
    heartDiv.style.alignItems = 'center';
    heartDiv.style.justifyContent = 'center';
    heartDiv.style.fontSize = '32px';
    heartDiv.style.zIndex = '5';
    heartDiv.style.pointerEvents = 'none';
    
    // Append to the game container
    const gameContainer = container || document.getElementById('game-container');
    if (gameContainer) {
        gameContainer.appendChild(heartDiv);
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
                // Get current lives value, default to 0 if undefined
                const currentLives = player.lives || 0;
                
                // Increase player's lives by +1 (direct property assignment)
                player.lives = currentLives + 1;
                
                // Remove the extra-life-drop from DOM immediately
                if (drop.parentNode) {
                    drop.parentNode.removeChild(drop);
                }
                
                console.log(`[Extra Life] Player ${player.id} picked up an extra life! New lives: ${player.lives}`);
                
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
    
    // Get the local player's name for display in popups
    const localPlayerName = getPlayerName();
    
    // Check if local player is eliminated
    if (localPlayerEntity !== null) {
        const localPlayer = world.getComponent(localPlayerEntity, 'Player');
        if (localPlayer && (localPlayer.lives ?? 0) <= 0) {
            // Check if already showed loss popup
            if (!document.querySelector('.game-result-popup')) {
                showLossPopup(localPlayerName);
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
                    showWinPopup(localPlayerName);
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
