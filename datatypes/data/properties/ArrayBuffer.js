/**
 * ArrayBuffer
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer
 */
'use strict';

module.exports = {
    zeroLength: new ArrayBuffer(0),
    thirtyTwoLength: new ArrayBuffer(32),

    withProperties: (function () {
        var buffer = new ArrayBuffer(16);
        buffer.foo = 'foo property';
        buffer.bar = {descr: 'bar property'};
        return buffer;
    }()),

    withCircularProperties: (function () {
        var buffer = new ArrayBuffer(16);
        buffer.foo = {};
        buffer.foo.bar = buffer.foo;
        return buffer;
    }())
};
