import { createElement, render } from "../../mini-framework/dom";
import router from "../../mini-framework/mini-framework";
import Register from "../pages/register";
import Lobby from "../pages/lobby";
import Game from "../pages/game";

const root = document.getElementById("root");
const wss = new WebSocket("ws://localhost:5000");

router.on("/", () => {
    console.log("/ we are in this route");
    
    render(<Register wss={wss} />, root);
});

router.listen(() => {alert("404")});

wss.addEventListener("open", (ws) => {
    
});

wss.addEventListener("message", (event) => {
    const message = JSON.parse(event.data);
    console.log("Received:", message);

    if (message.type === "room_update" || message.type === "lobby_timer") {
        render(
            <Lobby
                roomId={message.roomId}
                playersCount={message.playersCount}
                secondsLeft={message.secondsLeft}
            />,
            root
        );
    }

    if (message.type === "game_started") {
        render(
            <Game
                roomId={message.roomId}
                playersCount={message.playersCount}
            />,
            root
        );
    }
});

wss.addEventListener("error", (err) => {
    console.log("Error", err);
});

wss.addEventListener("close", () => {
    console.log("Closed");
});

export default wss;
