import { createElement } from "../../mini-framework/dom";

function Lobby() {
    let playerEnter = (e) => {
        console.log("RIGHTT HERE");
        
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        const nickname = formData.get("nickname");

        console.log(nickname);
    }

    return (
        <form onSubmit={playerEnter}>
            <input type="text" name="nickname" placeholder="eneter your name" />
            <button type="submit">start playing</button>
        </form>
    )
}

export default Lobby;