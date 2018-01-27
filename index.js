/*
 */
(function(express, http, io, crypto) {
    var routes = express();
    var server = http.createServer(routes);
    var websoc = io(server);

    websoc.on("connection", function(socket) {
	console.log("connected");
    });
    
    // Host public folder
    routes.use(express.static("public"));
    server.listen(8081);
})
(
    require("express"),
    require("http"),
    require("socket.io"),
    require("crypto")
);
