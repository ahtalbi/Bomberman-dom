import RoomsHandler from "./rooms.js";

let roomsHandler = new RoomsHandler();

export function handleWebsocket(message, ws) {
    switch (message.type) {
        case "nickname_of_the_player":
            if (!message.nickname) {
                sendError(ws, "Nickname is required");
                return;
            }

            if (message.nickname.length > 20) {
                sendError(ws, "Nickname must be less than 20 characters");
                return;
            }

            const error = roomsHandler.addPlayerToRoom(message.nickname, ws);
            if (error) {
                sendError(ws, error);
            }
            break;
        case "chat_message":
            if (!message.message) {
                sendError(ws, "Can't send empty message");
                return;
            }

            if (message.message.length > 20) {
                sendError(ws, "Can't send the message its too long");
                return;
            }

            roomsHandler.broadcastMessage(message.message, ws);
            break;
        case "MOVE_STATE":
            roomsHandler.broadcastGameMessage(ws, {
                type: "player_moved",
                payload: message.payload,
            });
            break;
        case "DROP_BOMB":
            roomsHandler.broadcastGameMessage(ws, {
                type: "bomb_dropped",
                payload: message.payload,
            });
            break;
        case "POWERUP_PICKED":
            roomsHandler.broadcastGameMessage(ws, {
                type: "powerup_picked",
                payload: message.payload,
            });
            break;
    }
}

export function handleDisconnect(ws) {
    roomsHandler.removePlayer(ws);
}

function sendError(ws, message) {
    ws.send(JSON.stringify({
        type: "error",
        message,
    }));
}
