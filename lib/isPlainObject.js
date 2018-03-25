'use strict';

// https://github.com/lodash/lodash/blob/master/isPlainObject.js
// https://github.com/jonschlinkert/is-plain-object/blob/master/index.js
// https://github.com/jquery/jquery/blob/1ea092a54b00aa4d902f4e22ada3854d195d4a18/src/core.js#L208

const toString = Object.prototype.toString;

function isPlainObject (value) {
    // Detect obvious negatives
    if (!value || toString.call(value) !== '[object Object]') {
        return false;
    }

    const proto = Object.getPrototypeOf(value);

    // Objects with no prototype (e.g. `Object.create(null)`) are plain.
    if (!proto) {
        return true;
    }

    // Objects with prototype are plain if they were constructed by a global Object function.
    return (
        proto === Object.prototype ||   // e.g. Object.create(null)
        value.constructor === Object    // e.g. Object.create({})
    );

    // let rootProto = baseProto;

    // while (Object.getPrototypeOf(rootProto) !== null) {
    //     rootProto = Object.getPrototypeOf(rootProto);
    // }

    // return rootProto === baseProto;
}

module.exports = isPlainObject;
