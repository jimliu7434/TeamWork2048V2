var singleGameData = [];


module.exports.addData = function (data) {
    if (!this.singleGameData)
        this.singleGameData = [];

    this.singleGameData.push(data);
};

module.exports.getData = function () {
    return this.singleGameData;
};

