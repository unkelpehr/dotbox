'use strict';

const isObject = require('./isPlainObject');

function set (target, path, value) {
    const segments = path.split('.');

    let ns = target;

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

    return target;
}

module.exports = set;
