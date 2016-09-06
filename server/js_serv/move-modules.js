var utilityModule = require(__dirname + '/utility-modules.js');
var checkmoveModule = require(__dirname + '/checkmove-modules.js');
var mergeModule = require(__dirname + '/merge-modules.js');
var shiftModule = require(__dirname + '/shift-modules.js');
var SIZE = 4; //const map size

var Modules = function() {};

Modules.prototype.move = function(map, prevmap, direction) {
    // 1. check if any move can be done
    if (!checkmoveModule.isCanMove(map, direction))
        return false;

    // 2. clone status to prevmap
    utilityModule.cloneMap(map, prevmap);
    
    // 3. do merge
    mergeModule.merge(map, direction);
    
    // 4. do shift
    shiftModule.shift(map, prevmap, direction);
    
    // 5. do randNew
    randNewItem(map, false);
    

    // 6. check if game over
    checkmoveModule.isGameOver(map);

    return true;
};

Modules.prototype.reset = function(map, prevmap) {
    var randCount = 2;

    // 1. clean map 
    initMap(map);

    // 2. do rand ( "2" times)
    for (var i = 0; i < randCount; i++) {
        randNewItem(map, true);
    }

    // 3. clone status to prevmap
    utilityModule.cloneMap(map, prevmap);

    return true;
};

Modules.prototype.rollback = function (map, prevmap) {
    // 1. rollback status from prevmap
    utilityModule.cloneMap(prevmap, map);
    return true;
};


module.exports = new Modules();


function initMap(map) {
    map.items = [];
    map.idmax = 0;
    map.score = 0;
    map.isgameover = false;
}

function randNewItem(map, isMust2) {
    // 亂數找出 value
    var value = 2;
    if (!isMust2) {
        value = (utilityModule.rand(0, 2) >= 2) ? 4 : 2;  // 「2」 出現的機率為 0.6667, 「4」出現的機率 0.3333    
    }
    
    var max = SIZE * SIZE ;
    var loopInterop = 100;  // while 上限
    if (map.items.length < max) {
        // 一直跑迴圈跑到找出新位置為止
        while (true) {
            var x = utilityModule.rand(0, SIZE - 1);
            var y = utilityModule.rand(0, SIZE - 1);
            
            if (!utilityModule.findByXY(map, x, y)) {
                var nitem = {
                    id: map.idmax + 1,
                    x: x,
                    y: y,
                    value: value,
                    preid: -1,
                    del: false
                };
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




