var utility = require(__dirname + "/utility-modules.js");
var DIRECT = utility.DirecEnum();
var SIZE = 4;
var Modules = function () { };

Modules.prototype.shift = function(map, prevmap, direction) {
    if (direction === DIRECT.A)
        return;

    if (map.items.length <= 0)
        return;
    
    // 先排序，因為 shift 有順序性
    if (direction === DIRECT.U) {
        map.items = map.items.sort(function(a, b) { return a.y - b.y; });
    } else if (direction === DIRECT.D) {
        map.items = map.items.sort(function(a, b) { return b.y - a.y; });
    } else if (direction === DIRECT.L) {
        map.items = map.items.sort(function(a, b) { return a.x - b.x; });
    } else if (direction === DIRECT.R) {
        map.items = map.items.sort(function(a, b) { return b.x - a.x; });
    }

    map.items.forEach(function(item) {
        shiftItem(map, direction, item);
    });

};


module.exports = new Modules();

function shiftItem(map, direction, item) {
    if (direction === DIRECT.A)
        return;
    
    if (item.del)
        return;
    
    var isToBound = false;
    var isToOtherItem = false;
    var nPosition = {
        x: item.x, 
        y: item.y
    };
    var temp, indexValue;
    var i = 1;      // 遞增
    var sign;       // 1 or -1 
    
    while (!isToBound && !isToOtherItem) {
        if (direction === DIRECT.U) {
            sign = -1;
            indexValue = item.y + (sign * i);
            if (indexValue < 0) {
                isToBound = true;
                nPosition = {
                    x: item.x, 
                    y: 0
                };
            }
            else {
                temp = utility.findByXY(map, item.x, indexValue);
                if (temp) {
                    isToOtherItem = true;
                    nPosition = {
                        x: item.x, 
                        y: indexValue + (sign * -1)
                    };
                }
            }
        }
        else if (direction === DIRECT.D) {
            sign = 1;
            indexValue = item.y + (sign * i);
            if (indexValue >= SIZE) {
                isToBound = true;
                nPosition = {
                    x: item.x, 
                    y: SIZE - 1
                };
            }
            else {
                temp = utility.findByXY(map, item.x, indexValue);
                if (temp) {
                    isToOtherItem = true;
                    nPosition = {
                        x: item.x, 
                        y: indexValue + (sign * -1)
                    };
                }
            }
        }
        else if (direction === DIRECT.L) {
            sign = -1;
            indexValue = item.x + (sign * i);
            if (indexValue < 0) {
                isToBound = true;
                nPosition = {
                    x: 0, 
                    y: item.y
                };
            }
            else {
                temp = utility.findByXY(map, indexValue, item.y);
                if (temp) {
                    isToOtherItem = true;
                    nPosition = {
                        x: indexValue + (sign * -1), 
                        y: item.y
                    };
                }
            }
        }
        else if (direction === DIRECT.R) {
            sign = 1;
            indexValue = item.x + (sign * i);
            if (indexValue >= SIZE) {
                isToBound = true;
                nPosition = {
                    x: SIZE - 1, 
                    y: item.y
                };
            }
            else {
                temp = utility.findByXY(map, indexValue, item.y);
                if (temp) {
                    isToOtherItem = true;
                    nPosition = {
                        x: indexValue + (sign * -1), 
                        y: item.y
                    };
                }
            }
        }
        
        i++;
    }
    
    // 移動到新位置
    item.x = nPosition.x;
    item.y = nPosition.y;
}