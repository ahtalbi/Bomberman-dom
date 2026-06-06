import { generateRandomDigits } from "./helpers.js";

class Player {
    constructor(nickname, ws) {
        this.id = generateRandomDigits(12);
        this.nickname = nickname;
        this.ws = ws;
    }
}

export default Player;
