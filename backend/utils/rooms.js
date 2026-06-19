import { generateRandomDigits } from "./helpers.js";
import Player from "./player.js";
import GameMap from "./map.js";

class RoomsHandler {
    constructor() {
        this.Rooms = new Map();
    }

    addRoom() {
        let room = new Room();
        let id = room.getIdRoom();
        this.Rooms.set(id, room);
    }

    addPlayerToRoom(nickname, ws) {
        const existingRoom = this.getRoomBySocket(ws);
        if (existingRoom) {
            const existingPlayer = existingRoom.players.find(player => player.ws === ws);
            if (existingPlayer) {
                existingPlayer.nickname = nickname;
            }
            existingRoom.broadcastRoomUpdate();
            return;
        }

        const lastKey = [...this.Rooms.keys()].at(-1);
        const lastRoom = this.Rooms.get(lastKey);
        const player = new Player(nickname, ws);

        if (lastRoom && lastRoom.length < 4 && !lastRoom.inGame) {
            lastRoom.addPlayer(player);
        } else {
            this.addRoom();
            this.Rooms.get([...this.Rooms.keys()].at(-1)).addPlayer(player);
        }
    }

    getRoomBySocket(ws) {
        for (const [_, room] of this.Rooms) {
            if (room.players.some(player => player.ws === ws)) {
                return room;
            }
        }
        return null;
    }

    removePlayer(ws) {
        for (const [roomId, room] of this.Rooms) {
            if (!room.removePlayer(ws)) continue;
            
            if (room.length === 0) {
                this.Rooms.delete(roomId);
            }
            break;
        }
    }

    broadcastMessage(message, ws) {
        for (let [_, room] of this.Rooms) {
            for (let player of room.players) {
                if (player.ws === ws) {
                    room.broadcastMessage(message);
                }
            }
        }
    }

    broadcastGameMessage(ws, message) {
        for (let [_, room] of this.Rooms) {
            const sender = room.players.find(player => player.ws === ws);
            if (sender) {
                room.broadcast({
                    ...message,
                    payload: {
                        ...message.payload,
                        id: sender.id,
                    },
                });
                return;
            }
        }
    }
}

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
        this.inLobby = false;
        this.inGame = false;
        this.players = [];
        this.secondsLeft = config.waitTime;
        this.deadPlayers = new Set();
        this.initialPlayerCount = 0; // Track players at game start
        this.timer = null;
    }

    addPlayer(player) {
        if (this.players.length < 4) {
            this.players.push(player);
        } else {
            throw new Error("Room is full");
        }

        this.broadcastRoomUpdate();

        if (this.players.length === 2) {
            this.startCountdown();
        }
    }

    removePlayer(ws) {
        const playerIndex = this.players.findIndex(player => player.ws === ws);
        if (playerIndex === -1) return false;

        const disconnectedPlayer = this.players[playerIndex];
        const disconnectedSocketId = disconnectedPlayer.socketId;
        console.log(`[DEBUG - Disconnect] Room: ${this.id} | SocketID: ${disconnectedSocketId} | PlayerName: ${disconnectedPlayer.nickname}`);
        console.log(`[DEBUG - Math] BEFORE Remove: TotalPlayers: ${this.players.length} | DeadPlayersSetSize: ${this.deadPlayers.size}`);

        this.players.splice(playerIndex, 1);

        if (this.players.length === 0) {
            clearInterval(this.timer);
            this.timer = null;
            return true;
        }

        if (this.inGame) {
            // Mark the disconnected player as "dead" if not already marked
            if (!this.deadPlayers.has(disconnectedSocketId)) {
                this.deadPlayers.add(disconnectedSocketId);
                console.log(`[DEBUG - Math] AFTER Add to deadSet: TotalPlayers: ${this.players.length} | DeadPlayersSetSize: ${this.deadPlayers.size}`);
            } else {
                console.log(`[DEBUG] Ignored duplicate death marker for disconnected player: ${disconnectedSocketId}`);
            }

            this.checkAndDeclareWinner();
            return true;
        }

        if (this.players.length === 1 && this.inLobby) {
            clearInterval(this.timer);
            this.timer = null;
            this.inLobby = false;
            this.secondsLeft = config.waitTime;
        }

        this.broadcastRoomUpdate();
        return true;
    }

    getAlivePlayersCount() {
        return this.players.length - this.deadPlayers.size;
    }

    checkAndDeclareWinner() {
        const roomId = this.id;
        console.log(`[DEBUG - Winner Check] Room: ${roomId} | TotalPlayers: ${this.players.length} | DeadPlayers: ${this.deadPlayers.size}`);

        if (this.initialPlayerCount <= 1 || this.players.length === 0) {
            console.log(`[DEBUG - EarlyReturn] InitialCount: ${this.initialPlayerCount} | PlayersLength: ${this.players.length}`);
            return;
        }

        // Debug: Log each player's alive/dead status
        this.players.forEach(player => {
            const isDead = this.deadPlayers.has(player.socketId);
            console.log(`[DEBUG - AliveCheck] SocketID: ${player.socketId} (${player.nickname}) | IsDead: ${isDead}`);
        });

        const aliveCount = this.getAlivePlayersCount();
        console.log(`[DEBUG - FinalResult] Room: ${roomId} | AliveCount: ${aliveCount} | WinTriggered: ${aliveCount === 1}`);

        if (aliveCount === 1) {
            const winner = this.players.find(p => !this.deadPlayers.has(p.socketId));
            console.log(`[DEBUG - Winner] WinnerSocketID: ${winner?.socketId} | WinnerName: ${winner?.nickname}`);
            if (winner) {
                this.broadcast({
                    type: "game_won",
                    winnerName: winner.nickname,
                });
            }
        } else if (aliveCount === 0 && this.players.length > 0) {
            // All players are dead (edge case)
            console.log(`[DEBUG - AllDead] All players eliminated in room ${roomId}`);
            this.broadcast({
                type: "game_won",
                winnerName: "Nobody - All players eliminated",
            });
        }
    }

    startCountdown() {
        this.inLobby = true;
        this.broadcastLobbyTimer();

        this.timer = setInterval(() => {
            this.secondsLeft--;

            if (this.secondsLeft <= 0 && !this.inGame) {
                this.inGame = true;
                this.secondsLeft = config.startTime;
                this.broadcastLobbyTimer();
                return;
            }

            if (this.secondsLeft <= 0 && this.inGame) {
                clearInterval(this.timer);
                this.timer = null;
                this.inLobby = false;

                this.initialPlayerCount = this.players.length; // Set the initial count
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

            this.broadcastLobbyTimer();
        }, 1000);
    }

    broadcastMessage(message) {
        this.broadcast({
            type: "chat_message",
            message: message,
        });
    }

    broadcastRoomUpdate() {
        this.broadcast({
            type: "room_update",
            roomId: this.id,
            playersCount: this.players.length,
            secondsLeft: this.timer ? this.secondsLeft : null,
            text: this.timer ? this.getLobbyText() : "Waiting for more players",
        });
    }

    broadcastLobbyTimer() {
        this.broadcast({
            type: "lobby_timer",
            roomId: this.id,
            playersCount: this.players.length,
            secondsLeft: this.secondsLeft,
            text: this.getLobbyText(),
        });
    }

    broadcast(message, exceptWs = null) {
        this.players.forEach(player => {
            if (player.ws === exceptWs) return;
            player.ws.send(JSON.stringify(message));
        });
    }

    getIdRoom() {
        return this.id;
    }

    getLobbyText() {
        return this.inGame ? config.startingText : config.waitingText;
    }

    get length() {
        return this.players.length;
    }
}

export default RoomsHandler;
