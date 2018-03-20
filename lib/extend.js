'use strict';

const kSeen = Symbol('Circular reference guard');

const isArray = Array.isArray;
const isObject = require('./isPlainObject');
const define = Object.defineProperty;

function dereferenceArray(source, hasSeen, setSeen) {
    let idx = 0;

    const length = source.length;
    const target = new Array(length);

    for (; idx < length; ++idx) {
        const sourceVal = source[idx];

        if (isObject(sourceVal)) {
            target[idx] = extend({}, sourceVal, hasSeen, setSeen);
        } else if (isArray(sourceVal)) {
            target[idx] = dereferenceArray(sourceVal, hasSeen, setSeen);
        } else {
            target[idx] = sourceVal;
        }
    }

    return target;
}

function hasSeen (object) {
    return object[kSeen];
}

function setSeen (object) {
    Object.defineProperty(object, kSeen, {
        writable: true,
        value: 1
    });
}

function extend (_target, _source, hasSeen, setSeen) {
    const target = _target;
    const source = _source;

    for (const key in source) {

        const sourceVal = source[key];
        const targetVal = target[key];
        
        if (isObject(sourceVal)) {

            if (hasSeen(sourceVal)) {
                target[key] = sourceVal;
            } else {
                setSeen(sourceVal);

                if (isObject(targetVal)) {
                    extend(targetVal, sourceVal, hasSeen, setSeen);
                } else {
                    extend(target[key] = {}, sourceVal, hasSeen, setSeen);
                }
            }

        } else if (sourceVal !== undefined) {

            if (isArray(sourceVal)) {
                target[key] = dereferenceArray(sourceVal, hasSeen, setSeen);
            } else {
                target[key] = sourceVal;
            }

        }
    }

    return target;
}

module.exports = (target, source) => {
    const seen = [];

    function setSeen (object) {
        object[kSeen] = 1;
    }

    function hasSeen (object) {
        return object[kSeen];
    }

    if (!isObject(target)) {
        return target;
    }

    if (!source) {
        source = target;
        target = {};
    }
    
    extend(target, source, hasSeen, setSeen);

    let i = 0;
    for (; i < seen.length; ++i) {
        delete seen[i][kSeen];
    }

    return target;
};

/* module.exports = (_target, _source) => {
    const seen = [];

    function setSeen (object) {
        object[kSeen] = 1;
    }

    function hasSeen (object) {
        return object[kSeen];
    }

    if (!isObject(_target)) {
        return _target;
    }

    const target = _source ? _target : {};
    const source = _source ? _source : _target;

    extend(target, source, hasSeen, setSeen);
    
    for (let i = 0, len = seen.length; i < len; ++i) {
        delete seen[i][kSeen];
    }

    return target;
};
 */