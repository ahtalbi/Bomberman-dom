import { createElement, render } from "../../mini-framework/dom";
import router from "../../mini-framework/mini-framework";
import Register from "../pages/register";
import Lobby from "../pages/lobby";
import Game from "../pages/game";
import Sound from "../utils/sound";

const root = document.getElementById("root");
const wss = new WebSocket("ws://localhost:5000");
const sound = new Sound("./assets/sounds/background_music.mp3");

sound.init();

router.on("/", () => {
    console.log("/ we are in this route");
    document.body.className = "register-page";
    
    render(<Register wss={wss} />, root);
});

router.listen(() => {alert("404")});

wss.addEventListener("open", (ws) => {
    
});

wss.addEventListener("message", (event) => {
    const message = JSON.parse(event.data);
    console.log("Received:", message);

    if (message.type === "room_update" || message.type === "lobby_timer") {
        document.body.className = "lobby-page";
        render(
            <Lobby
                roomId={message.roomId}
                playersCount={message.playersCount}
                secondsLeft={message.secondsLeft}
                text={message.text}
            />,
            root
        );
    }

    if (message.type === "game_started") {
        document.body.className = "game-page";
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
