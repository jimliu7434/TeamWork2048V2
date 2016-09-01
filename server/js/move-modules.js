var utilityModule = require('js/utility-modules.js');
var checkmoveModule = require('js/checkmove-modules.js');
var mergeModule = require('js/merge-modules.js');
var shiftModule = require('js/shift-modules.js');

function modules() {
    this.move = function (map, prevmap, direction, size) {
        // 1. check if any move can be done
        if (!checkmoveModule.isCanMove(map, direction)) 
            return false;
        
        // 2. clone status to prevmap
        this.cloneMap(map, prevmap);
        
        // 3. do merge
        mergeModule.mergeMap(map, size, direction);

        // 4. do shift
        shiftModule.shiftMap(map, size, direction);

        // 5. do randNew
        this.randNewItem(map, size, false);
        
        // 6. check if game over
        checkmoveModule.isGameOver(map);

        return true;
    },

    this.reset = function (map, prevmap, size) {
        var randCount = 2;
        
        // 1. clean map 
        this.initMap(map);
        
        // 2. do rand ( "2" times)
        for (var i = 0; i < randCount; i++) {
            this.randNewItem(map, size, true);
        }

        // 3. clone status to prevmap
        this.cloneMap(map, prevmap);

        return true;
    },

    this.rollback = function (map, prevmap) {
        // 1. rollback status from prevmap
        this.cloneMap(prevmap, map);     
        return true;
    }

    
}

module.exports = modules;


function initMap(map) {
    map.items = [];
    map.idmax = 0;
    map.score = 0;
    map.isgameover = false;
}

function randNewItem(map, size, isMust2) {
    // 亂數找出 value
    var value = (utilityModule.rand(0, 2) >= 2) ? 4 : 2;  // 「2」 出現的機率為 0.6667, 「4」出現的機率 0.3333
    value = (isMust2) ? 2 : value;            // 若 必須為 2 時，直接設定為 2
    
    
    var max = size * size;
    var loopInterop = 100;  // while 上限
    if (map.items.length < max) {
        // 一直跑迴圈跑到找出新位置為止
        while (true) {
            var x = utilityModule.rand(0, size - 1);
            var y = utilityModule.rand(0, size - 1);
            
            if (utilityModule.findByXY(map, x, y) === null) {
                var nitem = {
                    id : map.idmax + 1,
                    x: x,
                    y: y,
                    value: value,
                    preid: -1,
                    del: false
                }
                map.items.push(nitem);
                map.idmax += 1;
                break;  //中斷迴圈
            }
            
            // 強制中斷機制
            loopInterop--;
            if (loopInterop <= 0) {
                break;
            }
        }
    }   
}

// clone all map data to targetmap
function cloneMap(map, targetmap) {
    targetmap.score = map.score;
    targetmap.isgameover = map.isgameover;
    targetmap.items = cloneMapItems(map.items);        //不可以直接用 oldItems = newItems (call by ref when array)
    targetmap.idmax = map.idmax;
}

function cloneMapItems(mapItems) {
    var rtn = [];
    mapItems.forEach(function(item) {
        rtn.push(item);
    });
    return rtn;
}

