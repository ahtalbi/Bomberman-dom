import { createElement } from "../../mini-framework/dom";

function Lobby({ roomId, playersCount, secondsLeft, text, gameStarted }) {
    const timerText = secondsLeft === null || secondsLeft === undefined
        ? "Waiting for one more player"
        : `${secondsLeft} seconds`;

    return (
        <div>
            <h1>Lobby</h1>
            <p>Room ID: {roomId}</p>
            <p>Players: {playersCount} / 4</p>
            <p>{text}</p>
            <p>Timer: {gameStarted ? "Game started" : timerText}</p>
        </div>
    )
}

export default Lobby;
