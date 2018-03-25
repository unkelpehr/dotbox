'use strict';

const extend = require('./extend');
const isPlain = require('./isPlainObject');
const flags = require('./flags');

const dotProp = require('dot-prop');

const dotbox = {
    set: require('./set'),
    get: require('./get'),
}

function inspect (val) {
    console.log(require('util').inspect(val, { depth: null, colors: true, breakLength: 0 }), '\n');
}

/**
 * TODO.
 * @param {Integer} bitmask
 * @param {Object} target
 * @param {Object} source
 */
function patch (bitmask, target, source) {
    const isDeep = bitmask & flags.DMERGE;
    const isShallow = bitmask & flags.SMERGE;
    const isReplace = !isDeep && !isShallow;

    for (const key in source) {
        const newVal = source[key];
        const oldVal = dotbox.get(target, key);

        if (isReplace) {
            dotbox.set(target, key, extend(newVal));
        } else {
            if (!isPlain(oldVal) || !isPlain(newVal)) {
                dotbox.set(target, key, extend(newVal));
            } else if (isDeep) {
                extend(oldVal, newVal);
            } else {
                for (const key in newVal) {
                    oldVal[key] = extend(newVal[key]);
                }
            }
        }
    }

    return target;
}

module.exports = patch;
