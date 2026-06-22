import { createElement } from "../../mini-framework/dom";

export default function KickedMenu() {
    const returnBtn = <button class="replay-button">Return to Main Menu</button>;

    returnBtn.addEventListener("click", () => {
        // Hard reload using replace + timeout to avoid SPA routing race conditions
        window.location.replace('/');
        setTimeout(() => {
            window.location.reload();
        }, 100);
    });

    return (
        <div class="menu-box">
            <h1>KICKED FOR AFK!</h1>
            <p>You were removed from the match for switching tabs.</p>
            {returnBtn}
        </div>
    );
}
