'use strict';

const isObject = require('./isPlainObject');
const getSegments = require('./getSegments');

/**
 * Set the property at location `path` to `value`.
 * You can escape dots within the `path` by preceeding them with a \ backslash.
 * 
 * @example
 * const cars = {};
 * dotbox.set(cars, 'saab.models.9\\.7x.manufacturer', 'General Motors');
 * dotbox.set(cars, 'saab.models.9\\.7x.dimensions', {
 *   length: '4907mm',
 *   width: '2870mm',
 *   height: '1740mm',
 * });
 * 
 * @param {Object} object An object of key-value pairs of data to update.
 * @param {String} path A string identifying the name and location of the property to set.
 * @param {*} value The new data value; this can be of any type, including `undefined`.
 * @return {Object} `object` the object passed to update.
 */
function set (object, path, value) {
    if (!object || typeof object !== 'object') {
        return object;
    }

    if (!path || path === '.') {
        return object;
    }

    if (path.indexOf('.') === -1) {
        object[path] = value;
    }

    const segments = getSegments(path);

    let ns = object;

    for (let i = 0; i < segments.length; ++i) {
        const segment = segments[i];

        if (!isObject(ns[segment])) {
            ns[segment] = {};
        }

        if (i === segments.length - 1) {
            ns[segment] = value;
        }

        ns = ns[segment];
    }

    return object;
}

module.exports = set;
