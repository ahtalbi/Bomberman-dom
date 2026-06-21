import { createElement, render } from "../../mini-framework/dom";
import router from "../../mini-framework/mini-framework";
import Register from "../pages/register";
import Sound from "../utils/sound";
import { handleWebsocket } from "../utils/websocket.js";

const root = document.getElementById("root");
const wss = new WebSocket(`ws://${window.location.hostname}:5000`);
const sound = new Sound("./assets/sounds/background_music.mp3");

sound.init();

router.on("/", () => {
    document.body.className = "register-page";
    render(<Register wss={wss} />, root);
});

router.listen(() => { alert("404") });

wss.addEventListener("message", (event) => {
    const message = JSON.parse(event.data);
    handleWebsocket(message, root, wss);
});

export default wss;
