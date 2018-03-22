/**
 * Symbol
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol
 */
'use strict';

module.exports = {
    empty: Symbol(),
    withString: Symbol('a symbol with string'),
    withInteger: Symbol(123)
};
