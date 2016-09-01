/// <reference path="../node_modules/@types/vue/index.d.ts"/>
var moveModule = require('move-modules.js');
var utilityModule = require('utility-modules.js');

//directions enum
var DIREC = utilityModule.DirecEnum();



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
            this.items.forEach(function(item) {
                map[item.Y][item.X] = item;
            });

            return map;
        }
    },
    components: {
        'row': rowComponent
    }
});

Vue.components('gmap', mapComponent);

var vm = new Vue({
    el: "#gbody",
    template:"",
    data: {
        size: 4,
        isCanClick: true,
        disableRollback: true,
        disableReset: true,
        map: undefined,
        prevmap: undefined
    },
    methods: {
        reset: function() {
            if (moveModule.reset(map, prevmap, size)) {
                this.disableRollback = true;
                this.disableReset = true;
            }
        },
        rollback: function() {
            if (moveModule.rollback(map, prevmap, size)) {
                this.disableRollback = true;
            }
        },
        moveup : function(map, prevmap, size) {
            if (moveModule.move(map, prevmap, DIREC.U, size)) {
                this.diableRollback = false;
            }
        },
        movedown : function (map, prevmap, size) {
            if (moveModule.move(map, prevmap, DIREC.D, size)) {
                this.diableRollback = false;
            }
        },
        moveleft : function (map, prevmap, size) {
            if (moveModule.move(map, prevmap, DIREC.L, size)) {
                this.diableRollback = false;
            }
        },
        moveright : function (map, prevmap, size) {
            if (moveModule.move(map, prevmap, DIREC.R, size)) {
                this.diableRollback = false;
            }
        }
    }
});