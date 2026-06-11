import { createElement, render } from "../../mini-framework/dom";
import router from "../../mini-framework/mini-framework";
import Register from "../pages/register";
import Game from "../pages/game";
import Menu from "../pages/menu";
import Lobby from "../pages/lobby";
import { setStates } from "../pages/lobby";
import Sound from "../utils/sound";
import { setMessages } from "../components/chat";

const root = document.getElementById("root");
const wss = new WebSocket("ws://localhost:5000");
const sound = new Sound("./assets/sounds/background_music.mp3");

sound.init();

router.on("/", () => {
    document.body.className = "register-page";
    render(<Register wss={wss} />, root);
});

router.listen(() => { alert("404") });

wss.addEventListener("open", (ws) => {

});

wss.addEventListener("message", (event) => {
    const message = JSON.parse(event.data);
    switch (message.type) {
        case "room_update":
        case "lobby_timer":
            document.body.className = "lobby-page";
            if (!root.querySelector(".conatiner-lobby")) {
                render(<Lobby />, root);
            }
            setStates({
                roomId: message.roomId,
                playersCount: message.playersCount,
                secondsLeft: message.secondsLeft,
                text: message.text,
            });
            break;
        case "game_started":
            document.body.className = "game-page";
            render(<Game roomId={message.roomId} playersCount={message.playersCount} />, root);
            break;
        case "room_alone":
            document.body.className = "menu-page";
            render(<Menu />, root);
            break;
        case "chat_message":
            setMessages(prev => [...prev ,message.message]);
    }
});

wss.addEventListener("error", (err) => {
    console.log("Error", err);
});

wss.addEventListener("close", () => {
    console.log("Closed");
});

export default wss;
