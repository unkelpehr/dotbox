/**
 * Error types
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/EvalError
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/InternalError
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ReferenceError
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SyntaxError
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypeError
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/URIError
 */
'use strict';

const errors = {};

module.exports = errors;

function set (name, fn) {
    try {
        errors[name] = fn();
    } catch (e) {}
}

function createCustomError (message, getctor) {
    class ES6CustomError extends Error {
        constructor(message) {
            super(message)
            Error.captureStackTrace(this, ES6CustomError)
        }
    }

    if (getctor) {
        return ES6CustomError;
    }

    return new ES6CustomError(message);
}

set('evalErrorConstructor', () => EvalError);
set('errorConstructor', () => Error);
set('internalErrorConstructor', () => InternalError);
set('rangeErrorConstructor', () => RangeError);
set('referenceErrorConstructor', () => ReferenceError);
set('syntaxErrorConstructor', () => SyntaxError);
set('typeErrorConstructor', () => TypeError);
set('URIErrorConstructor', () => URIError);
set('ES6CustomErrorConstructor', () => createCustomError(null, true));

// set('evalErrorInstance', () => new EvalError('This is a `EvalError` with a message'));
// set('errorInstance', () => new Error('This is a regular `Error` with a message'));
// set('internalErrorInstance', () => new InternalError('This is a `InternalError` with a message'));
// set('rangeErrorInstance', () => new RangeError('This is a `RangeError` with a message'));
// set('referenceErrorInstance', () => new ReferenceError('This is a `ReferenceError` with a message'));
// set('syntaxErrorInstance', () => new SyntaxError('This is a `SyntaxError` with a message'));
// set('typeErrorInstance', () => new TypeError('This is a `TypeError` with a message'));
// set('URIErrorInstance', () => new URIError('This is a `URIError` with a message'));
// set('ES6CustomErrorInstance', () => createCustomError('This is a `ES6CustomError` with a message'));
