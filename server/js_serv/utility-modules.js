function modules() {
    // 根據設定的最大最小值產生亂數
    this.rand = function (min, max) {
        return Math.round(Math.random() * (max - min) + min);
    },

    // 從 mapObj.Items 中 根據 X,Y 座標尋找是否有此物件
    // 若有則回傳 物件
    // 若無則回傳 null
    this.findByXY = function (map, x, y) {
        if (map.Items === undefined || map.Items.length <= 0)
            return undefined;
        
        var rtn = undefined;
        map.Items.forEach(function (item) {
            if (item.X === x && item.Y === y) {
                rtn = item;
            }
        });
        
        return rtn;
    },

    this.DirecEnum = function () {
        return {
            U : 8,
            D : 2,
            L : 4,
            R : 6,
            A : 5
        };
    }

}

module.exports = modules;