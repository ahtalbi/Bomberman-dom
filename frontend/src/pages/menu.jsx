import { createElement } from "../../mini-framework/dom";

const replayBtn = <button class="replay-button">Play Again</button>;

replayBtn.addEventListener("click", () => {
    location.reload();
});

let menuEl = (
    <div class="menu-box">
        <h1>🎉 You Win!</h1>
        <p>All other players have left the game.</p>
        {replayBtn}
    </div>
);

export default function Menu() {
    return menuEl;
}
