import { createElement, render } from "../../mini-framework/dom";
import router from "../../mini-framework/mini-framework";
import Lobby from "../pages/lobby";

const root = document.getElementById("root");
const wss = new WebSocket("ws://localhost:5000");

router.on("/", () => {
    console.log("/ we are in this route");
    
    render(<Lobby />, root);
});

router.listen(() => {alert("404")});

wss.addEventListener("open", (ws) => {
    wss.send(JSON.stringify({
        type: "nickname_of_the_player",
        nickname: "Player1"
    }));
});

wss.addEventListener("message", (event) => {
    console.log("Received:", event.data);
});

wss.addEventListener("error", (err) => {
    console.log("Error", err);
});

wss.addEventListener("close", () => {
    console.log("Closed");
});

export default wss;