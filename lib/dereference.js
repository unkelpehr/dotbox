'use strict';

const extend = require('./extend');

/**
 * Takes an object and returns a new object, with all plain references removed.
 * 
 * This is not a clone function. It will leave references for anything that isn't a plain object (class instances, dates, functions, buffers etc).
 * It will also leave any internal (circular) references untouched.
 * 
 * It will however dereference arrays and any plain-object elements.
 * 
 * If you need a proper `clone` function I'd suggest looking into `lodash.clone` or `lodash.deepClone`.
 * @param {Object} object Object to dereference
 * @return {Object} Dereferences `object`
 */
function dereference (object) {
    return extend(object);
}

module.exports = dereference;
