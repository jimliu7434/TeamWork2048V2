var gamedata = require(__dirname + '/gamedata-modules.js');



var Modules = function() {};

Modules.prototype.init = function(server) {
    var io = require('socket.io').listen(server);

    io.sockets.on('connection', function(socket) {
        socket.on('reset', function(data) {
            var size = data.size;

            var gd = gamedata.getData();

            socket.emit('reset', { data: gd });
        });


        socket.on('test', function(data) {
            gamedata.addData(data);

            var gd = gamedata.getData();
        });
    });
};


module.exports = new Modules();