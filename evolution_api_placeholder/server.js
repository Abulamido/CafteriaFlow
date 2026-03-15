const http = require('http');

// A placeholder mock for the Evolution API service
const server = http.createServer((req, res) => {
    if (req.method === 'POST' && req.url.includes('/message/sendText')) {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            console.log("-> Evolution API Received Send Request:", body);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ status: "success", message: "Mock message sent" }));
        });
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end("Evolution API Placeholder limits reached - running correctly\n");
    }
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
    console.log(`Evolution API placeholder running on port ${PORT}`);
});
