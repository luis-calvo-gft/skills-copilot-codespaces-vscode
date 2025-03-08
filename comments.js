// Create web server
// Run server
// 1. Create web server
// 2. Listen for requests
// 3. Parse requests
// 4. Return responses
// 5. Return 404 if not found
// 6. Return 405 if method is not allowed
// 7. Return 500 if server error
// 8. Return 200 for successful request

// Load the http module to create an http server.
var http = require('http');
var url = require('url');
var fs = require('fs');
var path = require('path');
var mime = require('mime');
var comments = require('./comments');

// Configure our HTTP server to respond with Hello World to all requests.
var server = http.createServer(function (request, response) {
    var uri = url.parse(request.url).pathname;
    var filename = path.join(process.cwd(), uri);
    fs.exists(filename, function (exists) {
        if (!exists) {
            response.writeHead(404, { "Content-Type": "text/plain" });
            response.write("404 Not Found\n");
            response.end();
            return;
        }
        if (fs.statSync(filename).isDirectory()) {
            filename += '/index.html';
        }
        fs.readFile(filename, "binary", function (err, file) {
            if (err) {
                response.writeHead(500, { "Content-Type": "text/plain" });
                response.write(err + "\n");
                response.end();
                return;
            }
            var type = mime.lookup(filename);
            response.writeHead(200, { "Content-Type": type });
            response.write(file, "binary");
            response.end();
        });
    });
});

server.listen(8000);

// Put a friendly message on the terminal
console.log("Server running at http://