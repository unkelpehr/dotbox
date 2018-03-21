'use strict';

const extend = require('./extend');
const isPlainObject = require('./isPlainObject');

const dotProp = require('dot-prop');;

function patch (deep, target, source) {
    for (const key in source) {
        const sourceVal = source[key];
        const targetVal = dotProp.get(target, key);

        if (isPlainObject(targetVal)) {
            extend(targetVal, sourceVal);
        } else {
            dotProp.set(target, key, extend(sourceVal));
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
