/**
 * WeakMap
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakMap
 */
'use strict';

module.exports = {
    empty: new WeakMap(),

    filledWithIntegers: (function () {
        var map = new WeakMap();
        map.set({}, 1);
        map.set({}, 2);
        map.set({}, 3);
        return map;
    }()),

    withProperties: (function () {
        var map = new WeakMap();
        map.foo = 'foo property';
        map.bar = {descr: 'bar property'};
        return map;
    }())
};
