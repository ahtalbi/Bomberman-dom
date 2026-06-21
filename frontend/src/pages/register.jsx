import { createElement } from "../../mini-framework/dom";
import { createSignal, createEffect } from "../../mini-framework/reactivity";
import { setPlayerName } from "./game";

const [nicknameError, setNicknameError] = createSignal("");
export { setNicknameError };

function Register({ wss }) {
    const errorNickname = <p class="error-nickname"></p>;

    createEffect(() => {
        errorNickname.textContent = nicknameError();
    });

    let playerEnter = (e) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        const nickname = formData.get("nickname").trim();

        if (!nickname || nickname.length > 20) return;

        setPlayerName(nickname);

        wss.send(JSON.stringify({
            type: "register_player",
            nickname: nickname
        }));
    }

    return (
        <form class="register-form" onSubmit={playerEnter}>
            <input class="nickname-input" type="text" name="nickname" placeholder="enter your name" maxlength="20"/>
            <button class="register-button" type="submit">start playing</button>
            {errorNickname}
        </form>
    )
}

export default Register;
