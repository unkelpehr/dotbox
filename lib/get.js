'use strict';

const getSegments = require('./getSegments');

/**
 * Return the value at the given `path`.
 * You can escape dots within the `path` by preceeding them with a \ backslash.
 * 
 * @example
 * const cars = {
 *   saab: {
 *     models: {
 *       '9.7x':  {
 *         manufacturer: 'General Motors'
 *       }
 *     }
 *   }
 * };
 *
 * dotbox.get(cars, 'saab.models.9\\.7x.manufacturor'); // General Motors
 * dotbox.get(cars, 'saab.models.Buick Enclave.manufacturor'); // `undefined`
 * 
 * @param {Object} object The object to read from.
 * @param {String} path A string identifying the name and location of the property to set.
 * @return {*|Undefined} The value at given `path`, or `undefined`, if one did not exist.
 */
function get (object, path) {
    if (!object || typeof object !== 'object') {
        return;
    }

    if (!path || path === '.') {
        return object;
    }

    if (path.indexOf('.') === -1) {
        return object[path];
    }

    const segments = getSegments(path);
    const segmentsLen = segments.length;

    let value = object;

    for (let i = 0; i < segmentsLen; ++i) {
        const segment = segments[i];

        value = value[segment];

        if (i === segmentsLen - 1) {
            return value;
        }

        if (!value || typeof value !== 'object') {
            return;
        }
    }

    return value;
}

module.exports = get;
