import { createElement, render } from "../../mini-framework/dom";
import router from "../../mini-framework/mini-framework";
import Register, { setError } from "../pages/register";
import Game from "../pages/game";
import Menu from "../pages/menu";
import Lobby from "../pages/lobby";
import WinMenu from "../pages/WinMenu.jsx";
import KickedMenu from "../pages/KickedMenu.jsx";
import { setStates } from "../pages/lobby";
import { setPlayerName as setHudPlayerName } from "../pages/game";
import Sound from "../utils/sound";
import { setMessages } from "../components/chat";

import { GameEngine } from "../ecs/game.js"; 
import { handlePlayerDeath } from "../ecs/systems/damageSystem.js";
import { TILE_SIZE } from "../pages/game";

const root = document.getElementById("root");
const wss = new WebSocket("ws://localhost:5000");
window.socket = wss;
const sound = new Sound("./assets/sounds/background_music.mp3");
let currentGameEngine = null;

sound.init();

router.on("/", () => {
    document.body.className = "register-page";
    setMessages([]);
    render(<Register wss={wss} />, root);
});

router.listen(() => { alert("404") });

wss.addEventListener("open", (ws) => {
});

wss.addEventListener("message", (event) => {
    const message = JSON.parse(event.data);
    switch (message.type) {
        case "lobby_update":
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

        case "lobby_reset":
            if (currentGameEngine) {
                currentGameEngine.destroy();
                currentGameEngine = null;
            }
            document.body.className = "lobby-page";
            if (!root.querySelector(".conatiner-lobby")) {
                render(<Lobby />, root);
            }
            setStates({
                roomId: "",
                playersCount: 1,
                secondsLeft: 20,
                text: "Waiting for more players",
            });
            setMessages([]);
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

                    if (document.hidden) {
                        wss.send(JSON.stringify({ type: "leave_room" }));

                        currentGameEngine.destroy();
                        currentGameEngine = null;

                        document.body.className = "menu-page";
                        root.innerHTML = '';
                        root.appendChild(KickedMenu());
                        return; 
                    }

                    document.addEventListener("visibilitychange", function onAFK() {
                        if (document.hidden) {
                            document.removeEventListener("visibilitychange", onAFK);

                            wss.send(JSON.stringify({ type: "leave_room" }));

                            if (currentGameEngine) {
                                currentGameEngine.destroy();
                                currentGameEngine = null;
                            }

                            document.body.className = "menu-page";
                            root.innerHTML = '';
                            root.appendChild(KickedMenu());
                        }
                    });

                } else {
                    console.error("Game container was not found");
                }
            }, 50);
            break;

        case "room_alone":
            document.body.className = "menu-page";
            render(<Menu />, root);
            break;
            
        case "game_won":
            if (currentGameEngine) {
                currentGameEngine.destroy();
            }
            document.body.className = "menu-page";
            root.innerHTML = '';
            root.appendChild(WinMenu({ winnerName: message.winnerName }));
            break;

        case "player_turned_heart":
            if (currentGameEngine) {
                const entity = currentGameEngine.playerEntities.get(String(message.playerId));
                if (entity !== undefined) {
                    if (typeof handlePlayerDeath === 'function') {
                        handlePlayerDeath(currentGameEngine.world, entity, TILE_SIZE);
                    }
                    currentGameEngine.world.destroyEntity(entity);
                    currentGameEngine.playerEntities.delete(String(message.playerId));
                }
            }
            break;

        case "chat_message":
            setMessages(prev => [...prev, {
                nickname: message.nickname || "Player",
                message: message.message,
            }]);
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
        case "explosion_checked":
            if (currentGameEngine) {
                currentGameEngine.handleExplosionChecked(message.payload);
            }
            break;
        case "player_damaged":
            if (currentGameEngine) {
                currentGameEngine.handlePlayerDamaged(message.payload);
            }
            break;
        case "game_over":
            if (currentGameEngine) {
                currentGameEngine.handleGameOver(message.payload);
            }
            break;
        case "error":
            if (document.body.className === "register-page") {
                setError(message.message);
            } else {
                alert(message.message);
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
