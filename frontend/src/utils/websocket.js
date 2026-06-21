import { createElement, render } from "../../mini-framework/dom";
import Game from "../pages/game";
import Menu from "../pages/menu";
import Lobby from "../pages/lobby";
import { setStates } from "../pages/lobby";
import { setPlayerName as setHudPlayerName } from "../pages/game";
import { setMessages } from "../components/chat";
import { GameEngine } from "../ecs/game.js";

let currentGameEngine = null;

export function handleWebsocket(message, root, wss) {
    switch (message.type) {
        // this case is for update the lobby
        case "room_update":
        case "lobby_timer":
            // Fix: If we are already in a game, don't switch back to the lobby screen when someone quits
            if (document.body.className === "game-page") {
                setStates({
                    roomId: message.roomId,
                    playersCount: message.playersCount,
                    secondsLeft: message.secondsLeft,
                    text: message.text,
                });
                break;
            }

            document.body.className = "lobby-page";

            if (!root.querySelector(".container-lobby")) {
                render(<Lobby />, root);
            }

            setStates({
                roomId: message.roomId,
                playersCount: message.playersCount,
                secondsLeft: message.secondsLeft,
                text: message.text,
            });
            break;

        // this case is for start the game
        case "game_started":

            document.body.className = "game-page";
            render(<Game grid={message.grid} />, root);

            setTimeout(() => {
                const gameContainer = document.getElementById("game-container");

                if (gameContainer) {
                    if (currentGameEngine) {
                        currentGameEngine.destroy();
                    }

                    const localPlayer = (message.players || []).find(player => player.id === message.yourPlayerId);
                    if (localPlayer && localPlayer.nickname) {
                        setHudPlayerName(localPlayer.nickname);
                    }

                    const engine = new GameEngine(gameContainer, message.grid, wss);
                    engine.init(message.yourPlayerId, message.players || []);

                    currentGameEngine = engine;
                } else {
                    console.error("Game container was not found");
                }
            }, 50);
            break;

        // this case is for return to menu when room is alone
        case "room_alone":

            document.body.className = "menu-page";
            render(<Menu />, root);
            break;

        // this case is for game results (win, lost, draw)
        case "game_over":
        case "game_won": // Keep for backward compatibility if needed

            if (currentGameEngine) {
                currentGameEngine.destroy();
            }

            document.body.className = "menu-page";

            let title = "GAME OVER";
            let messageText = "The game has ended.";
            let btnText = "Play Again";

            if (message.result === "won") {
                title = `${(message.winnerName || "YOU").toUpperCase()} WON!`;
                messageText = "The last player standing takes the crown.";
            } else if (message.result === "lost") {
                title = "YOU LOST!";
                messageText = "Better luck next time!";
                btnText = "Play Another Time";
            } else if (message.result === "draw") {
                title = "IT'S A DRAW!";
                messageText = "Everyone went down in a blaze of glory.";
            }

            render(
                <Menu
                    title={title}
                    message={messageText}
                    buttonText={btnText}
                />,
                root
            );
            break;

        // this case is for receive a chat message
        case "chat_message":

            setMessages(prev => [...prev, message.message]);
            break;

        // this case is for move another player
        case "player_moved":

            if (currentGameEngine) {
                currentGameEngine.handleRemoteMove(message.payload);
            }
            break;

        // this case is for drop a bomb from another player
        case "bomb_dropped":

            if (currentGameEngine) {
                currentGameEngine.handleRemoteBomb(message.payload);
            }
            break;

        // this case is for pick up a power up or heart
        case "powerup_picked":

            if (currentGameEngine) {
                currentGameEngine.handleRemotePowerUpPicked(message.payload);
            }
            break;

        // this case is for when a player quits or refreshes
        case "player_quit":
            if (currentGameEngine) {
                currentGameEngine.removeRemotePlayer(message.playerId);
            }
            break;
    }
}
