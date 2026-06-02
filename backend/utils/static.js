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
    
    else if (req.url.startsWith("/assets/")) {
        filePath = path.resolve("../frontend/", req.url.slice(1));
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