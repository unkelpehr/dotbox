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

/*

class Foo { }
console.log('Math                 => false', isPlainObject(Math));
console.log('Math.abs             => false', isPlainObject(Math.abs));
console.log('class                => false', isPlainObject(new Foo));
console.log('array                => false', isPlainObject([1, 2, 3]));
console.log('{}                   => true', isPlainObject({ 'x': 0, 'y': 0 }));
console.log('Object.create(null)  => true', isPlainObject(Object.create(null)));
console.log('Object.create({})    => true', isPlainObject(Object.create({})));
console.log('new Object()         => true', isPlainObject(new Object()));
console.log('Object.prototype     => true', isPlainObject(Object.prototype));
console.log('Object               => false', isPlainObject(Object));
console.log('null                 => false', isPlainObject(null));
console.log('"str"                => false', isPlainObject('str'));
console.log('5                    => false', isPlainObject(5));
console.log('true                 => false', isPlainObject(true));
console.log('undefined            => false', isPlainObject(undefined));
console.log('new Date()           => false', isPlainObject(new Date()));
console.log('/foo/                => false', isPlainObject(/foo/));
console.log('[]                   => false', isPlainObject([]));
console.log('new Array()          => false', isPlainObject(new Array()));
console.log('function () {}       => false', isPlainObject(function () {}));

 */