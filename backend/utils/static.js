import fs from "fs";
import path from "path";

export function StaticHandler(req, res) {
    let filePath, contentType = "text/plain";

    if (req.url === "/") {
        filePath = path.resolve("../frontend/index.html");
        contentType = "text/html";
    }

    else if (req.url === "/dist/script.js") {
        filePath = path.resolve("../frontend/dist/script.js");
        contentType = "text/javascript";
    }

    else if (req.url === "/style.css") {
        filePath = path.resolve("../frontend/style.css");
        contentType = "text/css";
    }
    
    else if (req.url.startsWith("/assets/")) {
        filePath = path.resolve("../frontend/", req.url.slice(1));
        contentType = getContentType(filePath);
    }
    
    else {
        res.writeHead(404);
        return res.end("Not Found");
    }

    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(404);
            return res.end("Not Found");
        }

        res.writeHead(200, {
            "Content-Type": contentType
        });
        res.end(data);
    });
}

function getContentType(filePath) {
    const ext = path.extname(filePath);

    if (ext === ".png") return "image/png";
    if (ext === ".mp3") return "audio/mpeg";
    if (ext === ".mp4") return "video/mp4";
    if (ext === ".webp") return "image/webp";

    return "text/plain";
}
