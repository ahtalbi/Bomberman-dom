import { createElement } from "../../mini-framework/dom";

function Game({ roomId, playersCount }) {
    return (
        <div class="game-box">
            <h1>Game</h1>
            <p>Room ID: {roomId}</p>
            <p>Players: {playersCount}</p>
        </div>
    )
}

export default Game;
