import { createElement } from "../../mini-framework/dom";
import wss from "../app/app";

function Lobby() {
    let playerEnter = (e) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        const nickname = formData.get("nickname");

        console.log(nickname);
        
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

export default Lobby;