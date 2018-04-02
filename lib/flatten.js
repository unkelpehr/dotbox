'use strict';

const extend = require('./extend');
const isObject = require('./isPlainObject');

function isEmpty (object) {
    for (const key in object) {
        return false;
    }

    return true;
}

/**
 * TODO.
 * @param {Integer} depth Specifies the number of times `flatten` is allowed recurse while building the new object.
 * @param {Object} object Object to flatten
 * @param {Object} target The object to write to
 * @param {String} prefix 
 * @param {Array} seen 
 * @param {Integer} level 
 */
function flatten (depth, object, target, prefix, seen, level) {
    let isEmpty = true;

    for (const key in object) {
        const path = prefix + key;
        const val = object[key];

        if (level >= depth || !isObject(val)) {
            target[path] = val;
        } else {

            if (seen.indexOf(val) !== -1) {
                target[path] = {};
            } else {
                seen.push(val);
                flatten(depth, val, target, path + '.', seen, level + 1);
            }

        }

        isEmpty = false;
    }

    if (isEmpty && level) {
        target[prefix.slice(0, -1)] = {};
    }

    return target;
}

/**
 * TODO.
 * @param {Integer} depth Specifies the number of times to recurse while building the new object.
 * @param {Object} object Any Javascript object
 * @return {Object}
 */
module.exports = function (depth, object, target) {
    if (depth !== +depth) {
        target = object;
        object = depth;
        depth = Infinity;
    }

    target = target || {};

    flatten(depth, object, target, '', [], 0);

    // clearSeen();

    return target;
};
