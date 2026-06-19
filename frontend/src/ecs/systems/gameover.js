/**
 * Creates a Loss pop-up modal for the eliminated player.
 * Blocks their screen immediately so they cannot spectate.
 * This function is idempotent - it will only create the modal once.
 * @param {string} playerName - The name of the eliminated player
 * @returns {boolean} - True if modal was created, false if already exists
 */
export function showLossPopup(playerName) {
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
    
    // Create popup content container
    const popup = document.createElement('div');
    popup.className = 'popup-content';
    
    // Title with exact required text
    const titleEl = document.createElement('h1');
    titleEl.textContent = 'LOSER! Wach la3b b rjlik?';
    titleEl.className = 'popup-title';
    
    // Restart button with hard reset
    const button = document.createElement('button');
    button.textContent = 'Restart';
    button.className = 'popup-button';
    
    // Hard reset button - MUST use window.location.reload()
    button.addEventListener('click', () => {
        window.location.reload();
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