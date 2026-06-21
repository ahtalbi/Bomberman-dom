import RoomsHandler from "./rooms_handler.js";

let roomsHandler = new RoomsHandler();

export function handleWebsocket(message, ws) {
    switch (message.type) {
        // this case is for register the player
        case "nickname_of_the_player":

            if (!message.nickname) {
                sendError(ws, "Nickname is required");
                return;
            }

            if (message.nickname.length > 20) {
                sendError(ws, "Nickname must be less than 20 characters");
                return;
            }

            roomsHandler.addPlayerToRoom(message.nickname, ws);
            break;

        // this case to send a message
        case "chat_message":

            if (!message.message) {
                sendError(ws, "Can't send empty message");
                return;
            }

            if (message.message && message.length > 20) {
                sendError(ws, "Can't send the message its too long");
            }

            roomsHandler.broadcastMessage(message.message, ws);
            break;

        // this case to move the player
        case "move_state":

            roomsHandler.broadcastGameMessage(ws, {
                type: "player_moved",
                payload: message.payload,
            });
            break;

        // this case to drop a bomb
        case "drop_bomb":

            roomsHandler.broadcastGameMessage(ws, {
                type: "bomb_dropped",
                payload: message.payload,
            });
            break;
        
        // this case when you picked up a power up or heart
        case "powerup_picked":

            roomsHandler.broadcastGameMessage(ws, {
                type: "powerup_picked",
                payload: message.payload,
            });
            break;
        
        case "player_died":
            roomsHandler.handlePlayerDeath(ws);
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
