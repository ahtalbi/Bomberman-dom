import { createElement } from "../../mini-framework/dom";
import { setPlayerName } from "../ecs/game.js";
import { createSignal, createEffect } from "../../mini-framework/reactivity";
import { setMessages } from "../components/chat";

const [error, setError] = createSignal("");
export { setError };

function Register({ wss }) {
    let submitted = false;
    const errorEl = <p class="register-error"></p>;

    createEffect(() => {
        errorEl.textContent = error();
    });

    let playerEnter = (e) => {
        e.preventDefault();
        
        const formData = new FormData(e.currentTarget);
        const nickname = formData.get("nickname").trim();

        if (!nickname || nickname.length > 20) {
            setError("Invalid nickname");
            return;
        }

        setError("");
        submitted = true;
        setPlayerName(nickname);
        setMessages([]);

        wss.send(JSON.stringify({
            type: "nickname_of_the_player",
            nickname: nickname
        }));
    }

    return (
        <form class="register-form" onSubmit={playerEnter}>
            {errorEl}
            <input class="nickname-input" type="text" name="nickname" placeholder="enter your name" maxlength="20" />
            <button class="register-button" type="submit">start playing</button>
        </form>
    )
}

export default Register;
