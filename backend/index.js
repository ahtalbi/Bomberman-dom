import http from 'http';
import dotenv from 'dotenv';
import { WebSocketServer } from "ws";
import { StaticHandler } from './utils/static.js';

dotenv.config();

function main() {
    const server = http.createServer(StaticHandler);
    const wss = new WebSocketServer({ server });

    let counter = 0;
    wss.on("connection", (ws) => {
        console.log("new player entered", counter);
        counter++;
    });

    wss.on("close", (ws) => {
        console.log("the player quite", counter);
        counter--;
    });

    server.listen(process.env.PORT, () => {
        console.log(`Server is running on http://localhost:${process.env.PORT}`)
    })

    server.on("error", (e) => {
        console.error(`Server error: ${e.message}`)
    })
};

main();