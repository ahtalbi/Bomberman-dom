import { generateRandomDigits } from "./helpers.js";
import GameMap from "./map.js";

const config = {
    waitTime: 10,
    startTime: 3,
    waitingText: "Waiting for players",
    startingText: "Starting the game",
    colors: ["white", "red", "blue", "black"],
    starts: [
        { x: 1, y: 1 },
        { x: 15, y: 15 },
        { x: 15, y: 1 },
        { x: 1, y: 15 },
    ],
};

class Room {
    constructor() {
        this.id = generateRandomDigits();
        this.inGame = false;
        this.players = [];
        this.secondsLeft = config.waitTime;
        this.timer = null;
    }

    addPlayer(player) {
        if (this.players.length < 4) {
            this.players.push(player);
        } else {
            throw new Error("Room is full");
        }

        this.broadcast({
            type: "room_update",
            roomId: this.id,
            playersCount: this.players.length,
            secondsLeft: this.timer ? this.secondsLeft : null,
            text: this.timer ? this.getLobbyText() : "Waiting for more players",
        });

        if (this.players.length === 2) {
            this.startCountdown();
        }
    }

    handlePlayerDeath(ws) {
        const player = this.players.find(p => p.ws === ws);
        if (!player) return;

        ws.send(JSON.stringify({
            type: "game_over",
            result: "lost"
        }));

        this.removePlayer(ws);
    }

    removePlayer(ws) {
        const playerIndex = this.players.findIndex(player => player.ws === ws);
        if (playerIndex === -1) return false;

        const removedPlayer = this.players[playerIndex];
        this.players.splice(playerIndex, 1);

        if (this.inGame) {
            this.broadcast({
                type: "player_quit",
                playerId: removedPlayer.id
            });
        }

        if (this.players.length === 0) {
            clearInterval(this.timer);
            this.timer = null;
            return true;
        }

        if (this.players.length === 1 && this.inGame) {
            clearInterval(this.timer);
            this.timer = null;
            this.broadcast({
                type: "game_over",
                result: "won",
                winnerName: this.players[0].nickname
            });
            return true;
        }

        // If it's a lobby and only 1 remains, reset the timer
        if (this.players.length === 1 && !this.inGame) {
            clearInterval(this.timer);
            this.timer = null;
            this.secondsLeft = config.waitTime;
        }

        this.broadcast({
            type: "room_update",
            roomId: this.id,
            playersCount: this.players.length,
            secondsLeft: this.timer ? this.secondsLeft : null,
            text: this.timer ? this.getLobbyText() : "Waiting for more players",
        });
        return true;
    }

    startCountdown() {
        this.broadcast({
            type: "lobby_timer",
            roomId: this.id,
            playersCount: this.players.length,
            secondsLeft: this.secondsLeft,
            text: this.getLobbyText(),
        });

        this.timer = setInterval(() => {
            this.secondsLeft--;

            if (this.secondsLeft <= 0 && !this.inGame) {
                this.inGame = true;
                this.secondsLeft = config.startTime;
                this.broadcast({
                    type: "lobby_timer",
                    roomId: this.id,
                    playersCount: this.players.length,
                    secondsLeft: this.secondsLeft,
                    text: this.getLobbyText(),
                });
                return;
            }

            if (this.secondsLeft <= 0 && this.inGame) {
                clearInterval(this.timer);
                this.timer = null;

                const gameMap = new GameMap();

                const players = this.players.map((player, index) => ({
                    id: player.id,
                    nickname: player.nickname,
                    color: config.colors[index],
                    x: config.starts[index].x,
                    y: config.starts[index].y,
                }));

                this.players.forEach(player => {
                    player.ws.send(JSON.stringify({
                        type: "game_started",
                        roomId: this.id,
                        playersCount: this.players.length,
                        grid: gameMap.map,
                        players,
                        yourPlayerId: player.id,
                    }));
                });
                return;
            }

            this.broadcast({
                type: "lobby_timer",
                roomId: this.id,
                playersCount: this.players.length,
                secondsLeft: this.secondsLeft,
                text: this.getLobbyText(),
            });
        }, 1000);
    }

    broadcastMessage(message) {
        this.broadcast({
            type: "chat_message",
            message: message,
        });
    }

    broadcast(message, exceptWs = null) {
        this.players.forEach(player => {
            if (player.ws === exceptWs) return;
            player.ws.send(JSON.stringify(message));
        });
    }

    getLobbyText() {
        return this.inGame ? config.startingText : config.waitingText;
    }

    get length() {
        return this.players.length;
    }
}

export default Room;
