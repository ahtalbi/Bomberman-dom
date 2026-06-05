import RoomsHandler from "./rooms";

let RoomsHandler = new RoomsHandler();

export function handleWebsocket(message) {
    switch (message.type) {
        case "nickname_of_the_player":
            if (!message.nickname) throw new Error("Nickname is required");
            if (message.nickname.length > 20) throw new Error("Nickname must be less than 20 characters");
            RoomsHandler.addPlayerToRoom(message.nickname);
            break;
    }
}