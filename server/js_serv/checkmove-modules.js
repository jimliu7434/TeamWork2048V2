var utility = require(__dirname + "/utility-modules.js");
var DIRECT = utility.DirecEnum();
var SIZE = 4;//const map size

var Modules = function () { };


Modules.prototype.isCanMove = function(map, direction) {
    // 指定方向是否可合成
    if (isCanMerge(map, direction)) {
        return true;
    }

    // 指定方向Item 是否都已靠緊此方向
    if (isCanShift(map, direction)) {
        return true;
    }

    return false;
};
Modules.prototype.isGameOver = function(map) {
    if (!isFull(map))
        return false;

    return !this.isCanMove(map, DIRECT.A);
};


module.exports = new Modules();

// 判斷整張 Map 是否有可加總的數字
function isCanMerge(map, direction) {
    for (var i = 0; i < map.items.length; i++) {
        var item = map.items[i];
        if (isItemCanMerge(map, direction, item))
            return true;
    }
    return false;
}

// 根據指定方向 判斷指定 Item 是否可加總
function isItemCanMerge(map, direction, item) {
    var i;
    var listx;
    var listy;
    var listcanmerge = [];
    var nearestItem, temp;
    
    
    if (direction === DIRECT.A) {
        // 其中一個方向可以 Merger 就表示可以
        return (isItemCanMerge(map, DIRECT.U, item) ||
                isItemCanMerge(map, DIRECT.D, item) ||
                isItemCanMerge(map, DIRECT.L, item) ||
                isItemCanMerge(map, DIRECT.R, item));
    }
    else if (direction === DIRECT.U) {
        // 找出所有 同一列(X同) 但 Y 軸小於 item 之物件，並根據 Y 軸排序
        listx = utility.findXItems(map, item.x).sort(function (a, b) { return a.y - b.y; });
        for (i = 0; i < listx.length; i++) {
            temp = listx[i];
            if (item.y > temp.y) {
                listcanmerge.push(temp);
            }
        }
        
        // 已在邊邊或此方向已無其他數字，不可 Merge
        if (listcanmerge.length <= 0) {
            return false;
        }
        
        // 取最靠近的一個 (此處是最後一個)
        nearestItem = listcanmerge.pop();
        return (nearestItem.value === item.value);

    }
    else if (direction === DIRECT.D) {
        // 找出所有 同一列(X同) 但 Y 軸大於 item 之物件，並根據 Y 軸排序
        listx = utility.findXItems(map, item.x).sort(function (a, b) { return a.y - b.y; });
        for (i = 0; i < listx.length; i++) {
            temp = listx[i];
            if (item.y < temp.y) {
                listcanmerge.push(temp);
            }
        }
        
        // 已在邊邊或此方向已無其他數字，不可 Merge
        if (listcanmerge.length <= 0) {
            return false;
        }
        
        // 取最靠近的一個 (此處是第一個)
        nearestItem = listcanmerge[0];
        return (nearestItem.value === item.value);
    }
    else if (direction === DIRECT.L) {
        // 找出所有 同一列( Y 同) 但 X 軸小於 item 之物件，並根據 X 軸排序
        listy = utility.findYItems(map, item.y).sort(function (a, b) { return a.x - b.x; });
        for (i = 0; i < listy.length; i++) {
            temp = listy[i];
            if (item.x > temp.x) {
                listcanmerge.push(temp);
            }
        }
        
        // 已在邊邊或此方向已無其他數字，不可 Merge
        if (listcanmerge.length <= 0) {
            return false;
        }
        
        // 取最靠近的一個 (此處是最後一個)
        nearestItem = listcanmerge.pop();
        return (nearestItem.value === item.value);
    }
    else if (direction === DIRECT.R) {
        // 找出所有 同一列( Y 同) 但 X 軸大於 item 之物件，並根據 X 軸排序
        listy = utility.findYItems(map, item.y).sort(function (a, b) { return a.x - b.x; });
        for (i = 0; i < listy.length; i++) {
            temp = listy[i];
            if (item.x < temp.x) {
                listcanmerge.push(temp);
            }
        }
        
        // 已在邊邊或此方向已無其他數字，不可 Merge
        if (listcanmerge.length <= 0) {
            return false;
        }
        
        // 取最靠近的一個 (此處是第一個)
        nearestItem = listcanmerge[0];
        return (nearestItem.value === item.value);
    }
    else {
        return (isItemCanMerge(map, DIRECT.U, item) ||
                isItemCanMerge(map, DIRECT.D, item) ||
                isItemCanMerge(map, DIRECT.L, item) ||
                isItemCanMerge(map, DIRECT.R, item));
    }
}

// 判斷是否滿版
function isFull(map) {
    return (map.items.length === (SIZE * SIZE));
}

// 判斷整張 Map 是否已全部貼緊某方向
function isCanShift(map, direction) {
    //已在特定方向 bound 的不檢查
    //其他 Item 檢查是否可以向指定方向移動 (指定方向之value是否為0)
    
    if (direction === DIRECT.A)
        return false;
    
    if (map.items.length <= 0)
        return false;
    
    for (var i = 0; i < map.items.length ; i++) {
        if (isItemCanShift(map, direction, map.items[i])) {
            return true;
        }
    }
    
    return false;
}

// 根據指定方向 判斷指定 Item 是否可以移動
function isItemCanShift(map, direction, item) {
    var nextItem;
    
    if (direction === DIRECT.U) {
        // 已在最上
        if (item.y === 0)
            return false;
        
        // 往上找一格有找到 其他 item 的話，表示已靠緊
        nextItem = utility.findByXY(map, item.x , item.y - 1);
        if (nextItem) {
            return false;
        }
    }
    else if (direction === DIRECT.D) {
        // 已在最下
        if (item.y === SIZE - 1)
            return false;
        
        // 往下找一格有找到 其他 item 的話，表示已靠緊
        nextItem = utility.findByXY(map, item.x, item.y + 1);
        if (nextItem) {
            return false;
        }
    }
    else if (direction === DIRECT.L) {
        // 已在最左
        if (item.x === 0)
            return false;
        
        // 往左找一格有找到 其他 item 的話，表示已靠緊
        nextItem = utility.findByXY(map, item.x - 1, item.y);
        if (nextItem) {
            return false;
        }
    }
    else if (direction === DIRECT.R) {
        // 已在最右
        if (item.x === SIZE - 1)
            return false;
        
        // 往右找一格有找到 其他 item 的話，表示已靠緊
        nextItem = utility.findByXY(map, item.x + 1, item.y);
        if (nextItem) {
            return false;
        }
    }
    
    return true;
}