import { generateRandomDigits } from "./helpers.js";

class Player {
    constructor(nickname, ws) {
        this.id = generateRandomDigits(12);
        this.nickname = nickname;
        this.ws = ws;
        this.socketId = ws && typeof ws === 'object' ? (ws.socketId || Math.random().toString(36).substr(2, 9)) : null;
        if (ws && !ws.socketId) ws.socketId = this.socketId;
    }
}

export default Player;
