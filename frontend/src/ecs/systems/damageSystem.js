import { getPlayerName } from '../game.js';

/**
 * Creates a Loss pop-up modal for the eliminated player.
 * Blocks their screen immediately so they cannot spectate.
 * This function is idempotent - it will only create the modal once.
 * @param {string} playerName - The name of the eliminated player
 * @returns {boolean} - True if modal was created, false if already exists
 */
function showLossPopup(playerName) {
    // Prevent multiple renders - check if already exists
    if (document.querySelector('.game-result-popup')) {
        return false;
    }
    
    // Create overlay with extremely high z-index to block entire screen
    const overlay = document.createElement('div');
    overlay.className = 'game-result-popup loss';
    overlay.id = 'loss-modal';
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('role', 'dialog');
    
    // Inline styles for maximum compatibility and immediate rendering
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        z-index: 99999;
        background-color: rgba(0, 0, 0, 0.92);
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);
    `;
    
    // Create popup content container
    const popup = document.createElement('div');
    popup.style.cssText = `
        background: #1c1726;
        padding: 40px 50px;
        border: 6px solid #000000;
        box-shadow: 
            -6px 0 #000, 6px 0 #000, 0 -6px #000, 0 6px #000,
            inset -6px -6px 0 0 #100d17,
            inset 6px 6px 0 0 #3a314c;
        text-align: center;
        animation: slideIn 0.3s ease-out;
        max-width: min(450px, calc(100vw - 40px));
    `;
    
    // Title with exact required text
    const titleEl = document.createElement('h1');
    titleEl.textContent = 'LOSER! Wach la3b b rjlik?';
    titleEl.style.cssText = `
        font-family: 'Courier New', Courier, monospace;
        font-size: 42px;
        font-weight: 900;
        text-transform: uppercase;
        color: #ff4444;
        margin: 0 0 24px 0;
        text-shadow: 4px 4px 0px #000;
        letter-spacing: 2px;
    `;
    
    // Restart button with hard reset
    const button = document.createElement('button');
    button.textContent = 'Restart';
    button.style.cssText = `
        min-height: 48px;
        padding: 0 32px;
        font-family: 'Courier New', Courier, monospace;
        font-size: 18px;
        font-weight: 900;
        text-transform: uppercase;
        color: #000000;
        background: #ffc457;
        cursor: pointer;
        box-sizing: border-box;
        border: 4px solid #000000;
        box-shadow: 
            inset -4px -4px 0px 0px #b78119,
            inset 4px 4px 0px 0px #ffe19e;
        transition: background 0.2s ease;
    `;
    
    // Hard reset button - MUST use window.location.reload()
    button.addEventListener('click', () => {
        window.location.reload();
    });
    
    // Hover effect
    button.addEventListener('mouseenter', () => {
        button.style.background = '#ffd783';
    });
    button.addEventListener('mouseleave', () => {
        button.style.background = '#ffc457';
    });
    
    popup.appendChild(titleEl);
    popup.appendChild(button);
    overlay.appendChild(popup);
    
    // Append to document.body to block the entire screen immediately
    document.body.appendChild(overlay);
    
    // Disable scrolling on body
    document.body.style.overflow = 'hidden';
    
    return true;
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
    
    // 1. Remove the player's DOM element entirely
    if (renderable.el && renderable.el.parentNode) {
        renderable.el.parentNode.removeChild(renderable.el);
    }
    
    // 2. Destroy the player entity from the world (removes all components)
    world.destroyEntity(playerEntity);
    
    // 3. Spawn a HEART power-up entity at the death location (proper ECS entity)
    const gameContainer = container || document.getElementById('game-container');
    if (gameContainer) {
        spawnHeartPowerUp(world, deathGridX, deathGridY, gameContainer, tileSize);
    }
    
    console.log(`[Player Death] Player ${player.id} died at (${deathGridX}, ${deathGridY}). Heart power-up dropped.`);
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
