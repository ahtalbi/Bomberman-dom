import http from 'http';
import dotenv from 'dotenv';

dotenv.config();

function main() {
    http.createServer((req, res) => {
        if (req.url === '/' && req.method === 'GET') {
            res.writeHead(200)
            res.end('Home page')
        }

        else if (req.url === '/join' && req.method === 'POST') {
            res.writeHead(200)
            res.end('Join route')
        }

        else {
            res.writeHead(404)
            res.end('Not found')
        }
    })
        .listen(process.env.PORT, () => {
            console.log(`Backend is running on http://localhost:${process.env.PORT}`)
        })
        .on("error", (e) => {
            console.error(`Server error: ${e.message}`)
        })
};

main();