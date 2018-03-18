/**
 * Array
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array
 */
'use strict';

module.exports = {
    empty: [],
    emptyWithLength: new Array(10),

    filledWithFalsyValues: [0, '', false, null, undefined, NaN],

    filledWith3undefined: [
        undefined,
        undefined,
        undefined
    ],

    // Filled in the end.
    filledWithEverything: [],

    emptyBeginning: (function () {
        var arr = new Array(6);
        arr.push('a');
        arr.push('b');
        arr.push('c');
        return arr;
    }()),

    emptyMiddle: (function () {
        var arr = new Array(9);
        arr[3] = 'd';
        arr[4] = 'e';
        arr[5] = 'f';
        return arr;
    }()),

    emptyEnding: (function () {
        var arr = new Array(6);
        arr.unshift('c');
        arr.unshift('b');
        arr.unshift('a');
        return arr;
    }())
};
