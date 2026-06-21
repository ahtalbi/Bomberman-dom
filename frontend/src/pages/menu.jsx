import { createElement } from "../../mini-framework/dom";

export default function Menu({
        title = "You Win!",
        message = "All other players have left the game.",
        buttonText = "Play Again",
    } = {}) {
    const replayBtn = <button class="replay-button">{buttonText}</button>;

    replayBtn.addEventListener("click", () => {
        window.location.href = "/";
    });

    return (
        <div class="menu-box">
            <h1>{title}</h1>
            <p>{message}</p>
            {replayBtn}
        </div>
    );
}
