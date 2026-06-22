import { createElement } from "../../mini-framework/dom";
import { createSignal, createEffect } from "../../mini-framework/reactivity";
import ChatPlayers from "../components/chat";

let [states, setStates] = createSignal({});
export { setStates };

let roomIdEl = <p>Room ID: </p>;
let playersEl = <p>Players:  / 4</p>;
let textEl = <p></p>;
let timerEl = <p>Timer: </p>;

createEffect(() => {
    const s = states();
    roomIdEl.textContent = `Room ID: ${s.roomId}`;
    playersEl.textContent = `Players: ${s.playersCount} / 4`;
    textEl.textContent = s.text;
    if (s.secondsLeft) timerEl.textContent = "Time : " + s.secondsLeft;
    else timerEl.textContent = "";
});

function Lobby() {
    return (
        <div class="conatiner-lobby">
            <div class="lobby-box">
                <h1>Lobby</h1>
                {roomIdEl}
                {playersEl}
                {textEl}
                {timerEl}
            </div>
            <ChatPlayers />
        </div>
    )
}

export default Lobby;