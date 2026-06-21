import { createElement, render } from "../../mini-framework/dom";
import Game from "../pages/game";
import Menu from "../pages/menu";
import Lobby from "../pages/lobby";
import { setStates } from "../pages/lobby";
import { setMessages, setChatError } from "../components/chat";
import { setNicknameError } from "../pages/register";

export function WebSocketHandler(message) {
    switch (message.type) {
        case "lobby_update":
            document.body.className = "lobby-page";
            if (!root.querySelector(".conatiner-lobby")) {
                render(<Lobby />, root);
            }
            setStates({
                roomId: message.roomId,
                players: message.players,
                secondsLeft: message.secondsLeft,
                text: message.text,
            });
            break;
        case "game_started":
            document.body.className = "game-page";
            render(<Game grid={message.grid} />, root);
            break;
        case "room_alone":
            document.body.className = "menu-page";
            render(<Menu />, root);
            break;
        case "chat_message":
            setMessages(prev => [...prev ,message.message]);
            break;
        case "error_nickname":
            setNicknameError(message.message);
            break;
        case "error_message":
            setChatError(message.message);
            break;
    }
}
