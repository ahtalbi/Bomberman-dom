import { createElement } from "../../mini-framework/dom";

function Register({ wss }) {
    let playerEnter = (e) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        const nickname = formData.get("nickname").trim();

        if (!nickname || nickname.length > 20) return;

        wss.send(JSON.stringify({
            type: "nickname_of_the_player",
            nickname: nickname
        }));
    }

    return (
        <form class="register-form" onSubmit={playerEnter}>
            <input class="nickname-input" type="text" name="nickname" placeholder="enter your name" maxlength="20"/>
            <button class="register-button" type="submit">start playing</button>
        </form>
    )
}

export default Register;
