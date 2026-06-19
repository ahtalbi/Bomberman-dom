import { createElement } from "../../mini-framework/dom";

export default function WinMenu(props) {
    const winnerName = props.winnerName || "A Player";

    const replayBtn = <button class="replay-button">Play Again</button>;

    replayBtn.addEventListener("click", () => {
        // This hard reload is a reliable way to reset the game state and return to the start.
        location.reload();
    });

    return (
        <div class="menu-box">
            <h1>{winnerName.toUpperCase()} WON!</h1>
            <p>The last player standing takes the crown.</p>
            {replayBtn}
        </div>
    );
}