import { createElement, render } from "../../mini-framework/dom";
import router from "../../mini-framework/mini-framework";
import Register from "../pages/register";
import Game from "../pages/game";
import Menu from "../pages/menu";
import Lobby from "../pages/lobby";
import { setStates } from "../pages/lobby";
import { setPlayerName as setHudPlayerName } from "../pages/game";
import Sound from "../utils/sound";
import { setMessages } from "../components/chat";

import { GameEngine } from "../ecs/game.js"; 

const root = document.getElementById("root");
const wss = new WebSocket(`ws://${window.location.hostname}:5000`);
const sound = new Sound("./assets/sounds/background_music.mp3");
let currentGameEngine = null;

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

        case "room_alone":
            document.body.className = "menu-page";
            render(<Menu />, root);
            break;
            
        case "chat_message":
            setMessages(prev => [...prev ,message.message]);
            break;
        case "player_moved":
            if (currentGameEngine) {
                currentGameEngine.handleRemoteMove(message.payload);
            }
            break;
        case "bomb_dropped":
            if (currentGameEngine) {
                currentGameEngine.handleRemoteBomb(message.payload);
            }
            break;
        case "powerup_picked":
            if (currentGameEngine) {
                currentGameEngine.handleRemotePowerUpPicked(message.payload);
            }
            break;
    }
});

wss.addEventListener("error", (err) => {
    console.log("Error", err);
});

wss.addEventListener("close", () => {
    console.log("Closed");
});

export default wss;
