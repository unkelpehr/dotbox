'use strict';

const isPlainObject = require('./isPlainObject');

/**
 * TODO.
 * @param {Object} object
 * @param {Object} [_target=]
 * @param {String} [_prefix='']
 * @return {Object}
 */
function dottify (object, _target, _prefix) {
    let i;

    const keys = Object.keys(object).sort();
    const target = _target || {};
    const prefix = _prefix ? (_prefix + '.') : '';

    for (i = 0; i < keys.length; ++i) {
        const key = keys[i];
        const val = object[key];

        const path = prefix + key;
        const type = typeof val;

        if (type === 'function') {
            throw new TypeError(`Invalid data type '${type}' for property '${path}'`);
        }

        if (target[key]) {
            dottify(target[key], target, key);
            delete target[key];
        }

        if (isPlainObject(val)) {
            dottify(val, target, path);
        } else {
            target[path] = clone(val);
        }
    }

    return target;
}

module.exports = dottify;
