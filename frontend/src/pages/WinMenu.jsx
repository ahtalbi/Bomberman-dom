import { createElement } from "../../mini-framework/dom";
import router from "../../mini-framework/mini-framework";

export default function WinMenu(props) {
    const winnerName = props.winnerName || "A Player";

    const replayBtn = <button class="replay-button">Play Again</button>;

    replayBtn.addEventListener("click", () => {
        if (window.socket && window.socket.readyState === WebSocket.OPEN) {
            window.socket.send(JSON.stringify({ type: "leave_room" }));
        }

        router.navigate("/");
    });

    return (
        <div class="menu-box">
            <h1>{winnerName.toUpperCase()} WON!</h1>
            <p>The last player standing takes the crown.</p>
            {replayBtn}
        </div>
    );
}