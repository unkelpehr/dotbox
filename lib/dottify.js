'use strict';

const dotbox = require('dotbox');
const extend = dotbox.extend;
const isObject = dotbox.isPlainObject;

const kSeen = Symbol('Circular reference guard');

const seen = [];

function setSeen(object) {
    // object[kSeen] = 1;
    seen.push(object);
}

function hasSeen(object) {
    return seen.indexOf(object) !== -1;
    return object[kSeen];
}

function clearSeen() {
    for (let i = 0; i < seen.length; ++i) {
        delete seen[i][kSeen];
    }

    seen.length = 0;
}

function dottify (object, target, prefix, seen) {
    for (const key in object) {
        const path = prefix + key;
        const val = object[key];

        if (!isObject(val)) {
            target[path] = extend(val);
        } else {
            if (seen.indexOf(val) !== -1) {
                target[path] = {};
            } else {
                seen.push(val);
                dottify(val, target, path + '.', seen);
            }
        }
    }

    return target;
}

module.exports = (object) => {
    const target = {};

    dottify(object, target, '', []);

    // clearSeen();

    return target;
};
