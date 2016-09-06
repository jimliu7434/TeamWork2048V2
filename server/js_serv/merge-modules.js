var utility = require(__dirname + "/utility-modules.js");
var DIRECT = utility.DirecEnum();

var Modules = function () { };


    // 根據指定方向 Merge 整個 Map
Modules.prototype.merge = function(map, direction) {
    if (direction === DIRECT.A)
        return;

    if (map.items.length <= 0)
        return;

    // 先排序，因為 Merge 有順序性
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
        item.preid = -1;
        mergeItem(map, direction, item);
    });

    // 移除 ToDel = true 的 Items
    removeDelItems(map);

};

module.exports = new Modules();

function mergeItem(map, direction, item) {
    if (direction === DIRECT.A)
        return;
    
    // 若已被標註 del 代表已 Merge 入其他 item
    if (!item.del) {
        var i;
        var list;
        var listcanmerge = [];
        var nearestItem;
        
        if (direction === DIRECT.U) {
            // 找出所有 同一列(X同) 但 Y 軸小於 item 之物件，並根據 Y 軸排序
            list = utility.findXItems(map, item.x).sort(function (a, b) { return a.y - b.y; });
            for (i = 0; i < list.length; i++) {
                if (item.y > list[i].y) {
                    listcanmerge.push(list[i]);
                }
            }
            
            if (listcanmerge.length > 0) {
                // 取最靠近的一個 (此處是最後一個)
                nearestItem = listcanmerge.pop();
                if (nearestItem.value === item.value && !nearestItem.del) {
                    nearestItem.value = item.value + nearestItem.value;
                    nearestItem.preid = item.id;        // 紀錄已結合的前一個Item Id
                    item.del = true;                  // 標注移除
                    map.score += nearestItem.value;  // 更新分數
                }
            }
        }
        else if (direction === DIRECT.D) {
            // 找出所有 同一列(X同) 但 Y 軸大於 item 之物件，並根據 Y 軸排序
            list = utility.findXItems(map, item.x).sort(function (a, b) { return a.y - b.y; });
            for (i = 0; i < list.length; i++) {
                if (item.y < list[i].y) {
                    listcanmerge.push(list[i]);
                }
            }
            
            if (listcanmerge.length > 0) {
                // 取最靠近的一個 (此處是第一個)
                nearestItem = listcanmerge[0];
                if (nearestItem.value === item.value && !nearestItem.del) {
                    nearestItem.value = item.value + nearestItem.value;
                    nearestItem.preid = item.id;        // 紀錄已結合的前一個Item Id
                    item.del = true;                  // 標注移除
                    map.score += nearestItem.value;  // 更新分數
                }
            }
        }
        else if (direction === DIRECT.L) {
            // 找出所有 同一列( Y 同) 但 X 軸小於 item 之物件，並根據 X 軸排序
            list = utility.findYItems(map, item.y).sort(function (a, b) { return a.x - b.x; });
            for (i = 0; i < list.length; i++) {
                if (item.x > list[i].x) {
                    listcanmerge.push(list[i]);
                }
            }
            
            if (listcanmerge.length > 0) {
                // 取最靠近的一個 (此處是最後一個)
                nearestItem = listcanmerge.pop();
                if (nearestItem.value === item.value && !nearestItem.del) {
                    nearestItem.value = item.value + nearestItem.value;
                    nearestItem.preid = item.id;        // 紀錄已結合的前一個Item Id
                    item.del = true;                  // 標注移除
                    map.score += nearestItem.value;  // 更新分數
                }
            }
        }
        else if (direction === DIRECT.R) {
            // 找出所有 同一列( Y 同) 但 X 軸大於 item 之物件，並根據 X 軸排序
            list = utility.findYItems(map, item.y).sort(function (a, b) { return a.x - b.x; });
            for (i = 0; i < list.length; i++) {
                if (item.x < list[i].x) {
                    listcanmerge.push(list[i]);
                }
            }
            
            if (listcanmerge.length > 0) {
                // 取最靠近的一個 (此處是第一個)
                nearestItem = listcanmerge[0];
                if (nearestItem.value === item.value && !nearestItem.del) {
                    nearestItem.value = item.value + nearestItem.value;
                    nearestItem.preid = item.id;        // 紀錄已結合的前一個Item Id
                    item.del = true;                  // 標注移除
                    map.score += nearestItem.value;  // 更新分數
                }
            }
        }
    }
}

// 將已受標註 del = true 的物件從 Items 移除
function removeDelItems(map) {
    map.items = map.items.filter(function (item) {
        return item.del === false;
    });
}