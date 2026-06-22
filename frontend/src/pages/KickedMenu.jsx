import { createElement } from "../../mini-framework/dom";
import router from "../../mini-framework/mini-framework";

export default function KickedMenu() {
    const returnBtn = <button class="replay-button">Return to Main Menu</button>;

    returnBtn.addEventListener("click", () => {
        if (window.socket && window.socket.readyState === WebSocket.OPEN) {
            window.socket.send(JSON.stringify({ type: "leave_room" }));
        }

        router.navigate("/");
    });

    return (
        <div class="menu-box">
            <h1>KICKED FOR AFK!</h1>
            <p>You were removed from the match for switching tabs.</p>
            {returnBtn}
        </div>
    );
}
