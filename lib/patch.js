'use strict';

const extend = require('./extend');
const isPlain = require('./isPlainObject');

const dotProp = require('dot-prop');;

function patch (deep, target, source) {
    for (const key in source) {
        const newVal = source[key];
        const oldVal = dotProp.get(target, key);

        if (deep && isPlain(newVal) && isPlain(oldVal)) {
            extend(oldVal, newVal);
        } else {
            dotProp.set(target, key, extend(newVal));
        }
    }

    return target;
}

module.exports = (deep, target, sources) => {
    if (deep !== true && deep !== false) {
        sources = target;
        target = deep;
        deep = false;
    }
    
    if (!Array.isArray(sources)) {
        return patch(deep, target, sources);
    }

    for (let i = 0; i < sources.length; ++i) {
        patch(deep, target, sources[i]);
    }

    return target;
};
