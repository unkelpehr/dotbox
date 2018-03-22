/**
 * String
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String
 */
'use strict';

module.exports = {
    emptyLiteral: '',
    emptyObject: new String(''),

    filledLiteral: 'a string literal',
    filledObject: new String('a string object'),

    objectWithProperties: (function () {
        var str = new String('this string has properties');
        str.foo = 'foo property';
        str.bar = {descr: 'bar property'};
        return str;
    }())
};
