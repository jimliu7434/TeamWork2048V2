/// <reference path="../node_modules/@types/vue/index.d.ts"/>


var cellComponent = Vue.extend({
    template: "#cell-component-template",
    props:["item"]
});

var rowComponent = Vue.extend({
    template: "#row-component-template",
    props: ["items"],
    components: {
        'cell': cellComponent
    }
});

var mapComponent = Vue.extend({
    template: "#map-component-template",
    props: ["items", "size"],
    computed: {
        mapItems: function () {

            var map = [];
            if (this.items) {
                this.items.forEach(function(item) {
                    map[item.y][item.x] = item;
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
        disableReset: true,
        map: undefined,
        //prevmap: undefined,
        socket: undefined
    },
    methods: {
        reset: function () {
            if (this.socket) {
                this.socket.emit('reset', { size: this.size });
            }
        },
        rollback: function() {
            if (this.socket) {
                this.socket.emit('rollback');
            }
        },
        moveup : function() {
            if (this.socket) {
                this.socket.emit('up');
            }
        },
        movedown : function () {
            if (this.socket) {
                this.socket.emit('down');
            }
        },
        moveleft : function () {
            if (this.socket) {
                this.socket.emit('left');
            }
        },
        moveright : function () {
            if (this.socket) {
                this.socket.emit('right');
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
        var isMoved = data.isMoved;
        var nmap = data.map;
        
        if (isMoved) {
            //ui 處理
            model.map = nmap;
            model.disableRollback = true;
            model.disableReset = true;
        }
    });
    
    socket.on('rollback', function(data) {
        var isMoved = data.isMoved;
        var nmap = data.map;
        
        if (isMoved) {
            //ui 處理
            model.map = nmap;
            model.disableRollback = true;
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
    
    var isMoved = data.isMoved;
    var nmap = data.map;
    
    if (isMoved) {
        //ui 處理
        model.map = nmap;
        model.disableRollback = true;
    }
    
    //game over 處理
    if (model.map.isgameover) {
        //todo:
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
    return isCanClick ;
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