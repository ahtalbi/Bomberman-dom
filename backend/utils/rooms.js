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
            
            // Delete the room if it's empty, OR if the game ended (<= 1 alive player)
            if (room.length === 0 || (room.inGame && room.getAlivePlayersCount() <= 1)) {
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
        this.lockedInPlayers = null;
    }

    addPlayer(player) {
        if (this.players.length < 4) {
            this.players.push(player);
        } else {
            throw new Error("Room is full");
        }

        this.broadcastRoomUpdate();

        if (this.players.length === 2 && !this.inLobby && !this.inGame) {
            this.startCountdown();
        } else if (this.players.length === 4 && this.inLobby && !this.inGame) {
            this.inGame = true;
            this.secondsLeft = config.startTime;
            this.lockedInPlayers = [...this.players];
            this.broadcastLobbyTimer();
        }
    }

    removePlayer(ws) {
        const playerIndex = this.players.findIndex(player => player.ws === ws);
        if (playerIndex === -1) return false;

        const disconnectedPlayer = this.players[playerIndex];
        const disconnectedSocketId = disconnectedPlayer.socketId;
        console.log(`[DEBUG - Disconnect] Room: ${this.id} | SocketID: ${disconnectedSocketId} | PlayerName: ${disconnectedPlayer.nickname}`);
        console.log(`[DEBUG - Math] BEFORE Remove: TotalPlayers: ${this.players.length} | DeadPlayersSetSize: ${this.deadPlayers.size}`);

        if (this.inGame && this.inLobby) {
            this.players.splice(playerIndex, 1);
            if (this.lockedInPlayers) {
                const snapshotPlayer = this.lockedInPlayers.find(p => p.ws === ws);
                if (snapshotPlayer) snapshotPlayer.disconnected = true;
            }

            if (this.players.length === 1) {
                clearInterval(this.timer);
                this.timer = null;
                this.inLobby = false;
                this.inGame = false;
                this.secondsLeft = config.waitTime;
                this.lockedInPlayers = null;

                this.broadcast({ type: "lobby_reset" });
                this.broadcastRoomUpdate();
            } else {
                this.broadcastRoomUpdate();
            }
            return true;
        }

        this.players.splice(playerIndex, 1);

        if (this.players.length === 0) {
            clearInterval(this.timer);
            this.timer = null;
            return true;
        }

        if (this.inGame && !this.inLobby) {
            // Mark the disconnected player as "dead" if not already marked
            this.checkWinCondition(disconnectedSocketId);
            return true;
            return true;
        }

        if (this.players.length === 1 && this.inLobby && !this.inGame) {
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

    checkWinCondition(deadSocketId) {
        try {
            // 1. Mark as dead on the server
            if (deadSocketId && !this.deadPlayers.has(deadSocketId)) {
                this.deadPlayers.add(deadSocketId);
            }

            // 2. Check remaining alive players (using the snapshot count)
            const aliveCount = this.initialPlayerCount - this.deadPlayers.size;

            // 3. IF exactly 1 player remains -> They win!
            if (aliveCount === 1) {
                const winner = this.players.find(p => !this.deadPlayers.has(p.socketId));
                if (winner) {
                    this.broadcast({
                        type: "game_won",
                        winnerName: winner.nickname
                    });
                }
            // 4. IF more than 1 player remains -> Drop a heart
            } else if (aliveCount > 1 && deadSocketId) {
                // Find ECS id from the locked-in snapshot (in case they disconnected and were removed from this.players)
                const deadPlayer = this.lockedInPlayers.find(p => p.socketId === deadSocketId);
                if (deadPlayer) {
                    this.broadcast({
                        type: "player_turned_heart",
                        playerId: deadPlayer.id 
                    });
                }
            } else if (aliveCount === 0 && this.players.length > 0) {
                this.broadcast({
                    type: "game_won",
                    winnerName: "Nobody - All players eliminated"
                });
            }
            
            return aliveCount; // Useful if the caller needs to delete the room when aliveCount <= 1
        } catch (error) {
            console.error("[DEBUG - Error] checkWinCondition failed:", error);
            return -1;
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
                this.lockedInPlayers = [...this.players];
                this.broadcastLobbyTimer();
                return;
            }

            if (this.secondsLeft <= 0 && this.inGame) {
                clearInterval(this.timer);
                this.timer = null;
                this.inLobby = false;

                this.initialPlayerCount = this.lockedInPlayers.length; // Use snapshot
                
                // Add players who disconnected during the 3s countdown to deadPlayers
                this.lockedInPlayers.forEach(p => {
                    if (p.disconnected) {
                        this.deadPlayers.add(p.socketId);
                    }
                });

                const gameMap = new GameMap();

                const players = this.lockedInPlayers.map((player, index) => ({
                    id: player.id,
                    nickname: player.nickname,
                    color: config.colors[index],
                    x: config.starts[index].x,
                    y: config.starts[index].y,
                    disconnected: player.disconnected || false
                }));

                this.players.forEach(player => {
                    player.ws.send(JSON.stringify({
                        type: "game_started",
                        roomId: this.id,
                        playersCount: this.lockedInPlayers.length,
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
