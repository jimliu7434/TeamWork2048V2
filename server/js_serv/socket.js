var gamedata = require(__dirname + "/gamedata-modules.js");



var Modules = function() {};

Modules.prototype.init = function(server) {
    var io = require("socket.io").listen(server);

    io.sockets.on("connection", function(socket) {
        socket.on("reset", function(data) {
            var size = data.size;

            
            socket.emit("reset", { data: size });
        });
        
        socket.on("rollback", function (data) {
            var size = data.size;
            
            
            socket.emit("rollback", { data: gd });
        });
        
        socket.on("up", function (data) {
            var size = data.size;
            
            
            socket.emit("up", { data: gd });
        });
        
        socket.on("down", function (data) {
            var size = data.size;
            
            
            socket.emit("down", { data: gd });
        });
        
        socket.on("left", function (data) {
            var size = data.size;
            
            
            socket.emit("left", { data: gd });
        });
        
        socket.on("right", function (data) {
            var size = data.size;
            
            
            socket.emit("right", { data: gd });
        });

        socket.on("test", function(data) {
            
        });
    });
};


module.exports = new Modules();