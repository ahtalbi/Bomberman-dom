import RoomsHandler from "./rooms.js";

let roomsHandler = new RoomsHandler();

export function handleWebsocket(message, ws) {
    switch (message.type) {
        case "nickname_of_the_player":
            if (!message.nickname) throw new Error("Nickname is required");
            if (message.nickname.length > 20) throw new Error("Nickname must be less than 20 characters");
            roomsHandler.addPlayerToRoom(message.nickname, ws);
            break;
    }
}