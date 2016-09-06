var utility = require(__dirname + '/utility-modules.js');
var singleGameData = [];

module.exports.getData = function (socket) {
    if (this.singleGameData) {
        for (var i = 0; i < this.singleGameData.length; i++) {
            if (this.singleGameData[i].socket === socket) {
                return this.singleGameData[i];
            }
        }
    }
    
    return undefined;
};

module.exports.addData = function (socket, map, prevmap) {
    if (!this.singleGameData)
        this.singleGameData = [];

    var data = this.getData(socket);
    if (data) {
        this.removeData(socket);
    } 
    // do add
    this.singleGameData.push(genObj(socket, map, prevmap));    
    
};

module.exports.getAllData = function () {
    return this.singleGameData;
};

module.exports.removeData = function (socket) {
    var data = this.getData(socket);
    if (data) {
        // do remove
        this.singleGameData.splice(this.singleGameData.indexOf(data), 1);
    }
};

module.exports.initMaps = function() {
    return {
        map: {},
        prevmap: {}
    };
}

function genObj(socket, map, prevmap) {
    return {
        socket: socket,
        map: map,
        prevmap: prevmap
    };
}