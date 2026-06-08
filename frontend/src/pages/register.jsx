import { createElement } from "../../mini-framework/dom";

function Register({ wss }) {
    let playerEnter = (e) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        const nickname = formData.get("nickname").trim();

        if (!nickname) return;

        wss.send(JSON.stringify({
            type: "nickname_of_the_player",
            nickname: nickname
        }));
    }

    return (
        <form onSubmit={playerEnter}>
            <input type="text" name="nickname" placeholder="eneter your name" />
            <button type="submit">start playing</button>
        </form>
    )
}

export default Register;
