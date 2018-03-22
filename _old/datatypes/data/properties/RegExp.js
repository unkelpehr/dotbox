/**
 * RegExp
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp
 */
'use strict';

module.exports = {
    literal: /ab+c/i,
    objectWithLiteralParameter: new RegExp(/ab+c/, 'i'),
    objectWithStringParameter: new RegExp('ab+c', 'i'),
};
