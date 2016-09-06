var Modules = function () {};


// 根據設定的最大最小值產生亂數
Modules.prototype.rand = function(min, max) {
    return Math.round(Math.random() * (max - min) + min);
};

// 從 map.items 中 根據 x,y 座標尋找是否有此物件
// 若有則回傳 物件
// 若無則回傳 null
Modules.prototype.findByXY = function(map, x, y) {
    if (map.items === undefined || map.items.length <= 0)
        return undefined;

    var rtn = undefined;
    map.items.forEach(function(item) {
        if (item.x === x && item.y === y) {
            rtn = item;
        }
    });

    return rtn;
};

Modules.prototype.findXItems = function(map, x) {
    var rtn = [];
    map.items.forEach(function(item) {
        if (item.x === x)
            rtn.push(item);
    });
    return rtn;
};

Modules.prototype.findYItems = function(map, y) {
    var rtn = [];
    map.items.forEach(function(item) {
        if (item.y === y)
            rtn.push(item);
    });
    return rtn;
};

// clone all map data to targetmap
Modules.prototype.cloneMap = function(map, targetmap) {
    targetmap.score = map.score;
    targetmap.isgameover = map.isgameover;
    targetmap.items = cloneMapItems(map.items);        //不可以直接用 oldItems = newItems (call by ref when array)
    targetmap.idmax = map.idmax;
};

Modules.prototype.DirecEnum = function() {
    return {
        U: 8,
        D: 2,
        L: 4,
        R: 6,
        A: 5
    };
};

module.exports = new Modules();


function cloneMapItems(items) {
    var rtn = [];
    items.forEach(function (item) {
        rtn.push(cloneItem(item));
    });
    return rtn;
}

function cloneItem(item) {
    return {
        id: item.id,
        x: item.x,
        y: item.y,
        value: item.value,
        preid: item.preid,
        del: item.del
    };
}