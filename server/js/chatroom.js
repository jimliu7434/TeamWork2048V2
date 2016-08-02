﻿var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var sql = require(__dirname + '/js/sql.js');

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/socket.html');
});


//指定port
http.listen(process.env.PORT || 8001, function () {
    console.log('listening on *:8001');
});

io.on('connection', function (socket) {
    socket.on('user_login', function (data) {
        socket.username = data.username;

        var now = new Date();
        var nowStr = now.toLocaleDateString() + ' ' + now.toLocaleTimeString();
        console.log(nowStr + ' ' + data.username + ' Login!');

        sql.getLeaderList(
            {
                sortType: 0,
                startIndex: 1,
                rowCount: 10
            },
            function (rtndata) {
                SendLeaderboard(socket, rtndata);
            });

    });




    socket.on('chat_message', function (data) {
        var now = new Date();
        var nowStr = now.toLocaleDateString() + ' ' + now.toLocaleTimeString();
        console.log(nowStr + ' ' + socket.username + ' ' + data.msg);

        io.emit('chat_message', {
            'time': nowStr,
            'user': socket.username,
            'msg': data.msg
        });
    });
});


function SendLeaderboard(socket, data) {
    socket.emit('sendLeaderboard', data);
}