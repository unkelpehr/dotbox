'use strict';

// https://github.com/jquery/jquery/blob/1ea092a54b00aa4d902f4e22ada3854d195d4a18/src/core.js#L208

/*

const toString = Object.prototype.toString;
const getProto = Object.getPrototypeOf;
const hasOwn = Object.prototype.hasOwnProperty;

function isObjectObject (thingy) {
    return (
        typeof thingy === 'object' &&
        toString.call(thingy) === '[object Object]'
    );
}

function isPlainObject (thingy) {
    if (!thingy || toString.call(thingy) !== '[object Object]') {
        return false;
    }

    const proto = getProto(thingy);

    // Objects with no prototype (e.g., `Object.create( null )`) are plain
    if (!proto) {
        return true;
    }

    // Objects with prototype are plain iff they were constructed by a global Object function
    const ctor = hasOwn.call(proto, "constructor") && proto.constructor;
    return typeof ctor === "function" && fnToString.call(ctor) === ObjectFunctionString;
}

module.exports = isPlainObject;

*/
const toString = Object.prototype.toString;

function isObjectObject (thingy) {
    return (
        typeof thingy === 'object' &&
        toString.call(thingy) === '[object Object]'
    );
}

function isPlainObject (thingy) {
    if (!thingy || !isObjectObject(thingy)) {
        return false;
    }

    if (Object.getPrototypeOf(thingy) === null) {
        return true
    }

    const ctor = thingy.constructor;

    // If has modified constructor
    if (!ctor || typeof ctor !== 'function') {
        return false;
    }

    const prot = ctor.prototype;

    // If has modified prototype
    if (!prot || !isObjectObject(prot)) {
        return false;
    }

    // If constructor does not have an Object-specific method
    if (!prot.hasOwnProperty('isPrototypeOf')) {
        return false;
    }

    // Most likely a plain Object
    return true;
}

module.exports = isPlainObject;
