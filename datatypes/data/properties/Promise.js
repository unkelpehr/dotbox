/**
 * Promise
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
 */
'use strict';

module.exports = {
    constructor: Promise,
    pendingPromise: new Promise(function () {}),
    resolvedPromise: Promise.resolve('This is a resolved promise'),
    // rejectedPromise: Promise.reject('This is a rejected promise'),
};
