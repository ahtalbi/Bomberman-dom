import http from 'http';
import dotenv from 'dotenv';
import { WebSocketServer } from "ws";
import { StaticHandler } from './utils/static.js';
import { handleWebsocket } from './utils/websocket.js';

dotenv.config();

function main() {
    const server = http.createServer(StaticHandler);
    const wss = new WebSocketServer({ server });

    wss.on("connection", (ws) => {
        ws.on("message", (message) => {
            handleWebsocket(JSON.parse(message), ws);
        })

        ws.on("close", (ws) => {
            //tell the room that the player left
        });
    });


    server.listen(process.env.PORT, () => {
        console.log(`Server is running on http://localhost:${process.env.PORT}`)
    })

    server.on("error", (e) => {
        console.error(`Server error: ${e.message}`)
    })
};

main();