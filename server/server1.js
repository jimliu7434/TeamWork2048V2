var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var http = require('http');
var server = http.createServer(app);


var clog = require(__dirname + '/js/log.js');

server.listen(9000, function () {
    clog.consoleLog(1, 'listen', 'ready on port 9000');
});

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

app.use('/css', express.static('css'));
app.use('/fonts', express.static('fonts'));
app.use('/images', express.static('images'));
app.use('/js', express.static('js'));
app.use('/js_lib', express.static('js_lib'));

app.get('/pages/single', function (req, res) {
    res.sendFile(__dirname + '/pages/vue-game-single.html');
});
app.get('/pages/demo', function (req, res) {
    res.sendFile(__dirname + '/pages/vue-demo.html');
});

var gameSocketIo = require(__dirname + '/js_serv/socket.js');
gameSocketIo.init(server);
