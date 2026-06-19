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

            roomsHandler.addPlayerToRoom(message.nickname, ws);
            break;
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
        case "ITEM_PICKUP":
            // Broadcast heart pickup to all players so they can update lives
            roomsHandler.broadcastGameMessage(ws, {
                type: "item_picked",
                payload: message.payload,
            });
            break;
        case "player_died":
            const room = roomsHandler.getRoomBySocket(ws);
            const player = room ? room.players.find(p => p.ws === ws) : null;

            // **DUPLICATE GUARD (THE FILTER)**: Check if this is a new death event
            if (room && room.inGame && !room.deadPlayers.has(player?.socketId)) {
                // Valid, new death event - process it
                room.deadPlayers.add(player.socketId);

                const alivePlayersCount = room.players.length - room.deadPlayers.size;
                console.log(`[DEBUG - Math] ${player.nickname} died. Alive remaining: ${alivePlayersCount}`);
                console.log(`[Game Event] Player ${player.nickname} (ID: ${player.id}) was eliminated in room ${room.id}.`);

                // Only trigger game_won if exactly 1 player remains alive
                if (alivePlayersCount === 1) {
                    room.checkAndDeclareWinner();
                    // Explicitly delete the room so ghost players don't persist
                    roomsHandler.Rooms.delete(room.id);
                }
            } else if (room && player?.socketId) {
                // Duplicate event detected - ignore it silently but log for debugging
                console.log(`[DEBUG] Ignored duplicate death event from: ${player.socketId}`);
            }
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
