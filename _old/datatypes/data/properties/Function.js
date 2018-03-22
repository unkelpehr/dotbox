/**
 * Function
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function
 */
'use strict';

var funcs = module.exports = {};

function set (name, fn) {
    try {
        funcs[name] = fn();
    } catch (e) {}
}

set('unnamedFunctionDeclaration', () => {
    return function (n1, n2) { return n1 + n2; };
});

set('namedFunctionDeclaration', () => {
    return function namedFunctionDeclaration (n1, n2) { return n1 + n2; };
});

set('functionExpression', () => {
    var functionExpression = function (n1, n2) { return n1 + n2; };
    return functionExpression;
});

set('namedFunctionExpression', () => {
    var namedFunctionExpression = function namedFunctionExpression (n1, n2) { return n1 + n2; };
    return namedFunctionExpression;
});

set('arrowFunction', () => (n1, n2) => n1 + n2);

set('generatorFunction', () => {
    function* generatorFunction () {
        var index = 0;
        while (index < index + 1) {
            yield index++;
        }
    }

    return generatorFunction;
});

set('constructedFunction', () => {
    return new Function('n1', 'n2', 'return n1 + n2');
});