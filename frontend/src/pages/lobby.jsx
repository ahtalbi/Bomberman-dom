import { createElement } from "../../mini-framework/dom";
import ChatPlayers from "../components/chat";

function Lobby({ roomId, playersCount, secondsLeft, text, gameStarted }) {
    const timerText = secondsLeft === null || secondsLeft === undefined
        ? "Waiting for one more player"
        : `${secondsLeft} seconds`;

    return (
        <div class="lobby-box">
            <h1>Lobby</h1>
            <p>Room ID: {roomId}</p>
            <p>Players: {playersCount} / 4</p>
            <p>{text}</p>
            <p>Timer: {gameStarted ? "Game started" : timerText}</p>
            <ChatPlayers />
        </div>
    )
}

export default Lobby;
