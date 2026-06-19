import { createElement } from "../../mini-framework/dom";

function GameOver({ payload, localPlayerId }) {
    const { winnerId, isDraw } = payload;
    
    // Use the passed localPlayerId to determine if the local player won
    const isWinner = !isDraw && winnerId === localPlayerId;
    const titleText = isDraw ? "It's a Draw!" : (isWinner ? "You Win!" : "Game Over");
    const messageText = isDraw ? "You and the other player were eliminated at the same time." : (isWinner ? "Congratulations, you are the last one standing!" : "Better luck next time!");

    const replayBtn = <button class="replay-button">Play Again</button>;
    replayBtn.addEventListener("click", () => {
        window.location.href = "/";
    });

    // In a future step, you could add a "Spectate" button here if the game is still ongoing.

    return (
        <div class="menu-box">
            <h1>{titleText}</h1>
            <p>{messageText}</p>
            {replayBtn}
        </div>
    );
}

export default GameOver;