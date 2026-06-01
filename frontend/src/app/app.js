import { render } from "../../mini-framework/dom";

const root = document.getElementById("root");
const wss = new WebSocket("ws://localhost:5000");

wss.addEventListener("open", () => {
    console.log("Connected");
});

wss.addEventListener("error", (err) => {
    console.log("Error", err);
});

wss.addEventListener("close", () => {
    console.log("Closed");
});