/**
 * Map
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map
 */
'use strict';

module.exports = {
    empty: new Map(),

    filledWithFalsyValues: (function () {
        var map = new Map();
        map.set('0', 0);
        map.set('emptyString', '');
        map.set('false', false);
        map.set('null', null);
        map.set('undefined', undefined);
        map.set('NaN', NaN);
        return map;
    }()),

    filledWith5undefined: (function () {
        var map = new Map();
        map.set('1', undefined);
        map.set('2', undefined);
        map.set('3', undefined);
        map.set('4', undefined);
        map.set('5', undefined);
        return map;
    }()),

    // Filled in the end.
    filledWithEverything: []
};
