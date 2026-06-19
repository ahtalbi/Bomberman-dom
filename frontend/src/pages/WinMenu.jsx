import { createElement } from "../../mini-framework/dom";

export default function WinMenu(props) {
    const winnerName = props.winnerName || "A Player";

    const replayBtn = <button class="replay-button">Play Again</button>;

    replayBtn.addEventListener("click", () => {
        // Explicitly close the old WebSocket to prevent zombie connections
        if (window.socket) { 
            window.socket.close(); 
            window.socket = null; 
        }

        // Hard reload to wipe JS memory and start from a clean slate
        window.location.href = '/';
    });

    return (
        <div class="menu-box">
            <h1>{winnerName.toUpperCase()} WON!</h1>
            <p>The last player standing takes the crown.</p>
            {replayBtn}
        </div>
    );
}