/// <reference path="../node_modules/@types/vue/index.d.ts"/>


var cellComponent = Vue.extend({
    template: "#cell-component-template",
    props: ["source"],
    computed: {
        item: function() {
            if (this.source) {
                return this.source;
            }
            return { value: 0 };
        },
        styleObj: function() {
            var color = getColor(this.item.value);
            return { background: color };
        }
    }
});

var rowComponent = Vue.extend({
    template: "#row-component-template",
    props: ["source", "size"],
    computed: {
        items: function () {
            if (!this.size) {
                return undefined;
            }

            var map = [];
            for (var i = 0; i < this.size; i++) {
                map.push(undefined);
            }
            this.source.forEach(function(item) {
                map[item.x] = item;
            });
            return map;
        }  
    },
    components: {
        'cell': cellComponent
    }
});

var mapComponent = Vue.extend({
    template: "#map-component-template",
    props: ["source", "size"],
    computed: {
        items: function () {
            if (!this.size) {
                return undefined;
            }

            var map = [];
            for (var i = 0; i < this.size; i++) {
                map.push([]);
            }

            if (this.source) {
                this.source.items.forEach(function (item) {
                    if (!map[item.y])
                        map[item.y] = [];

                    map[item.y].push(item);
                });
            }
            return map;
        }
    },
    components: {
        'row': rowComponent
    }
});

Vue.component('gmap', mapComponent);

var vm = new Vue({
    el: "#gbody",
    template:"",
    data: {
        size: 4,
        isCanClick: true,
        disableRollback: true,
        disableReset: false,
        map: undefined,
        //prevmap: undefined,
        socket: undefined,
        msg:""
    },
    methods: {
        reset: function () {
            if (this.socket) {
                this.socket.emit('reset', {});
            }
        },
        rollback: function() {
            if (this.socket) {
                this.socket.emit('rollback', {});
            }
        },
        moveup : function() {
            if (this.socket) {
                this.socket.emit('up', {});
            }
        },
        movedown : function () {
            if (this.socket) {
                this.socket.emit('down', {});
            }
        },
        moveleft : function () {
            if (this.socket) {
                this.socket.emit('left', {});
            }
        },
        moveright : function () {
            if (this.socket) {
                this.socket.emit('right', {});
            }
        },
        test: function(data) {
            if (this.socket) {
                this.socket.emit('test', { data: data });
            }
        }
    }
});

$(document).ready(function() {
    document.onkeydown = keyFunction;

    //使用行動裝置
    initMobile();

    initMoveSocketEvents();
});


function initMoveSocketEvents() {
    if (!vm)
        return;

    var model = vm.$data;
    model.socket = io();
    var socket = vm.$data.socket;

    socket.on("reset", function (data) {
        if (data.result === 0) {
            //ui 處理
            model.map = data.maps.map;
            //model.prevmap = data.maps.prevmap;
            model.disableRollback = true;
            model.disableReset = true;
            model.msg = "";
        }
    });
    
    socket.on('rollback', function(data) {
        if (data.result === 0) {
            //ui 處理
            model.map = data.maps.map;
            //model.prevmap = data.maps.prevmap;
            model.disableRollback = true;
            model.msg = "";
        }
    });
    
    socket.on('up', function(data) {
        onMoveCompleted(data);
    });
    
    socket.on('down', function(data) {
        onMoveCompleted(data);
    });
    
    socket.on('left', function(data) {
        onMoveCompleted(data);
    });
    
    socket.on('right', function(data) {
        onMoveCompleted(data);
    });
}

function onMoveCompleted(data) {
    var model = vm.$data;
  
    
    if (!data.maps || !data.maps.map)
        return;
    
    var nmap = data.maps.map;
    if (data.result === 0) {
        //ui 處理
        model.map = nmap;
        //model.prevmap = data.maps.prevmap;
        model.disableReset = false;
        model.disableRollback = false;
    }
    
    //game over 處理
    if (nmap.isgameover) {
        model.msg = "Game Over";
    }
}

function initMobile() {
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        $(document).on("swipeleft", function () {
            if (isCanSendKey()) {
                vm.moveleft();
            }
        });
        
        $(document).on("swiperight", function () {
            if (isCanSendKey()) {
                vm.moveright();
            }
        });
        
        $(document).on("swipeup", function () {
            if (isCanSendKey()) {
                vm.moveup();
            }
        });
        $(document).on("swipedown", function () {
            if (isCanSendKey()) {
                vm.movedown();
            }
        });
    }
}

function isCanSendKey() {
    return true ;
}

function keyFunction() {
    if (event.keyCode === 37 && isCanSendKey()) {
        vm.moveleft();
    } else if (event.keyCode === 38 && isCanSendKey()) {
        vm.moveup();
    } else if (event.keyCode === 39 && isCanSendKey()) {
        vm.moveright();
    } else if (event.keyCode === 40 && isCanSendKey()) {
        vm.movedown();
    }
}

function getColor(value) {

    var r = 238, g = 225, b = 225;
    
    if (value <= 0) {
        return getColorString(238, 225, 225);
    }
    else {
        var lg2 = getLog2(value, 0);
        if (lg2 === undefined) {
            return getColorString(238, 225, 225);
        }

        g = (g - (lg2 * 10) > 0) ? g - (lg2 * 10) : 0;
        b = (b - (lg2 * 10) > 0) ? b - (lg2 * 10) : 0;

        return getColorString(r, g, b);
    } 
    
    //var color = {
    //    a0: "#CDC1B4", //205 193 180
    //    a2: "#EEE4DA", //238 228 218
    //    a4: "#EEE1C9", //238 225 201
    //    a8: "#F3B27A", //243 178 122
    //    a16: "#F69664", //246 150 100
    //    a32: "#FAA661", //250 166 97
    //    a64: "#F88363", //248 99 99
    //    a128: "#FC5D5D", //252 61 61
    //    a256: "#FC3A2A", //251 48 32
    //    a512: "#DB160F", //255 22 15
    //    a1024: "#AB000F", //255 0 15
    //    a2048: "#8F0000" // 255 0 0
    //};
}

function getLog2(value, ans) {
    if (Math.pow(2, ans) === value) {
        return ans;
    }
    else if (ans >= 50) {
        return undefined;
    } 
    else {
        return getLog2(value, ans + 1);
    }
}

function dec2hex(v) {
    return (+v).toString(16);
}

function getColorString(rdec, gdec, bdec) {
    return "#" + dec2hex(rdec) + dec2hex(gdec) + dec2hex(bdec);
}