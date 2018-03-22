/**
 * Object
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object
 */
'use strict';

module.exports = {
    plainEmpty: {},
    plainFilled: {a: 1},
    nested: {a:{b: {c: 1}}, d: {e: {f: {g: 2}}}},

    toplevelCircular: (function () {
        var obj = {};
        obj.foo = {};
        obj.bar = obj.foo;
        obj.bar.qux = 1;
        return obj;
    }()),

    nestedCircular: (function () {
        var obj = {};
        obj.foo = {};
        obj.foo.bar = obj.foo;
        return obj;
    }())
};
