'use strict';

const isObject = require('./isPlainObject');

const isEnumerable = Object.prototype.propertyIsEnumerable;

function get (source, path) {
    const segments = path.split('.');

    let value = source;

    for (let i = 0; i < segments.length; ++i) {
        const segment = segments[i];

        if (!isObject(value) || !isEnumerable.call(value, segment)) {
            return;
        }

        value = value[segment];

        if (i === segments.length - 1) {
            return value;
        }
    }

    return value;
}

module.exports = get;
