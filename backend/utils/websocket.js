import RoomsHandler from "./rooms_handler.js";

let roomsHandler = new RoomsHandler();

// this function to handle the web socket
export function handleWebsocket(message, ws) {
    switch (message.type) {
        case "register_player":
            if (!message.nickname) {
                sendError(ws, {
                    type: "error_nickname",
                    message: "Can't entere empty nickname"
                });
                return;
            }

            if (message.nickname.length > 20) {
                sendError(ws, {
                    type: "error_nickname",
                    message: "Nickname must be less than 20 characters"
                });
                return;
            }

            roomsHandler.addPlayerToRoom(message.nickname, ws);
            break;
        case "chat_message":
            if (!message.message) {
                sendError(ws, {
                    type: "error_message",
                    message: "Can't send empty message"
                });
                return;
            }

            if (message.message && message.length > 20) {
                sendError(ws, {
                    type: "error_message",
                    message: "Can't send message too long more than > 20 chars"
                });
                return;
            }
            
            roomsHandler.broadcastMessage(message.message, ws);
            break;
    }
}

// handle disconnect player
export function handleDisconnect(ws) {
    roomsHandler.removePlayer(ws);
}

function sendError(ws, message) {
    ws.send(JSON.stringify(message));
}