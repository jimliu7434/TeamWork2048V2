var gamedata = require(__dirname + "/gamedata-modules.js");
var moveModule = require(__dirname + "/move-modules.js");
var utility = require(__dirname + "/utility-modules.js");

var DIRECT = utility.DirecEnum();

var Modules = function() {};

Modules.prototype.init = function(server) {
    var io = require("socket.io").listen(server);

    io.sockets.on("connection", function(socket) {
        socket.on("reset", function() {
            // init maps obj
            var maps = gamedata.initMaps();
            // do [reset] calculate
            if (moveModule.reset(maps.map, maps.prevmap)) {
                // save result to gamedata
                gamedata.addData(socket, maps.map, maps.prevmap);
                // send result to client
                socket.emit("reset", {
                    result: 0,
                    maps: {
                        map: maps.map
                    }
                });

                return;
            }

            // when error
            socket.emit("reset", {
                result: -1,
                maps: undefined
            });
        });
        
        socket.on("rollback", function () {
            var data = gamedata.getData(socket);
            if (data) {
                // do [rollback] calculate
                if (moveModule.rollback(data.map, data.prevmap)) {
                    // send to client
                    socket.emit("rollback", {
                        result: 0,
                        maps: {
                            map: data.map
                        }
                    });
                    return;
                }
            } 

            // when error
            socket.emit("rollback", {
                result: -1,
                maps: undefined
            });
            
        });
        
        socket.on("up", function () {
            var data = gamedata.getData(socket);
            if (data) {
                // do [move] calculate
                if (moveModule.move(data.map, data.prevmap, DIRECT.U)) {
                    // send to client
                    socket.emit("up", {
                        result: 0,
                        maps: {
                            map: data.map
                        }
                    });
                    return;
                }
            }

            // when error
            socket.emit("up", {
                result: -1,
                maps: undefined
            });
        });
        
        socket.on("down", function () {
            var data = gamedata.getData(socket);
            if (data) {
                // do [move] calculate
                if (moveModule.move(data.map, data.prevmap, DIRECT.D)) {
                    // send to client
                    socket.emit("down", {
                        result: 0,
                        maps: {
                            map: data.map
                        }
                    });
                    return;
                }
            }
            
            // when error
            socket.emit("down", {
                result: -1,
                maps: undefined
            });
        });
        
        socket.on("left", function () {
            var data = gamedata.getData(socket);
            if (data) {
                // do [move] calculate
                if (moveModule.move(data.map, data.prevmap, DIRECT.L)) {
                    // send to client
                    socket.emit("left", {
                        result: 0,
                        maps: {
                            map: data.map
                        }
                    });
                    return;
                }
            }
            
            // when error
            socket.emit("left", {
                result: -1,
                maps: undefined
            });
        });
        
        socket.on("right", function () {
            var data = gamedata.getData(socket);
            if (data) {
                // do [move] calculate
                if (moveModule.move(data.map, data.prevmap, DIRECT.R)) {
                    // send to client
                    socket.emit("right", {
                        result: 0,
                        maps: {
                            map: data.map
                        }
                    });
                    return;
                }
            }
            
            // when error
            socket.emit("right", {
                result: -1,
                maps: undefined
            });
        });

        socket.on("test", function(data) {
            
        });

        socket.on("disconnect", function () {
            gamedata.removeData(socket);

            console.log(socket.id + " is left.");
        });
    });

};


module.exports = new Modules();