'use strict';

const flags = require('./flags');
const isPlain = require('./isPlainObject');
const getSegments = require('./getSegments');
const extend = require('./extend');

/**
 * Set the property at location `path` to `value`.
 * You can escape dots within the `path` by preceeding them with a \ backslash.
 * 
 * @example
 * const cars = {};
 * dotbox.set(cars, 'saab.models.9\\.7x.manufacturer', 'General Motors');
 * dotbox.set(cars, 'saab.models.9\\.7x.dimensions', {
 *   width: '1918mm',
 *   height: '1740mm',
 * });
 *
 * @example
 * // Using an object of key-value pairs as source
 * dotbox.set(dotbox.DMERGE, cars, {
 *   'saab.models.9\\.7x': {
 *     dimensions': {
 *       length: '4907mm',
 *       wheelbase: '2870mm'
 *     }
 *   }
 * });
 * 
 * @param {Integer} [bitmask=0] todo.
 * @param {Object} object An object of key-value pairs of data to update.
 * @param {String|Object} path A string identifying the name and location of the property to set.
 * @param {*} value The new data value; this can be of any type, including `undefined`.
 * @return {Object} `object` the object passed to update.
 */
function set (bitmask, object, path, value) {
    // Optional `bitmask`
    if (bitmask !== +bitmask) {
        value = path;
        path = object;
        object = bitmask;
        bitmask = 0;
    }

    if (!path || !object || typeof object !== 'object') {
        return object;
    }

    // set(bitmask, object, {key: val})
    if (value === undefined && typeof path === 'object') {
        for (const _path in path) {
            set(bitmask, object, _path, path[_path]);
        }

        return object;
    }

    const opts = flags.parse(bitmask);
    const segments = getSegments(path);

    let ns = object;

    for (let i = 0; i < segments.length; ++i) {
        const segment = segments[i];

        if (!isPlain(ns[segment])) {
            ns[segment] = {};
        }

        if (i === segments.length - 1) {
            if (!opts.SMERGE && !opts.DMERGE) {
                // Regular replace
                ns[segment] = value;
            } else {
                const newVal = value;
                const oldVal = ns[segment];

                if (!isPlain(oldVal) || !isPlain(newVal)) {
                    // Deep or shallow merge, but one of the values
                    // are not a plain object. Hence no need to merge.
                    ns[segment] = newVal;
                } else if (opts.DMERGE) {
                    // Deep merge
                    extend(oldVal, newVal);
                } else {
                    // Shallow merge
                    for (const key in newVal) {
                        oldVal[key] = newVal[key];
                    }
                }
            }
        }

        ns = ns[segment];
    }

    return object;
}

module.exports = set;
