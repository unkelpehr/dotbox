'use strict';

const set = require('./set');

function patch (bitmask, target, source) {
    for (const key in source) {
        set(bitmask, target, key, source[key]);
    }

    return target;
}

module.exports = patch;
