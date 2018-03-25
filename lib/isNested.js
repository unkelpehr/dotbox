'use strict';

/**
 * Check whether given path is nested, i.e. has one or more
 * dots in it that are not preceeded by one or more backslashes.
 * 
 * If `path` is not of type `string`, `false` will always be returned.
 * 
 * @example
 * isNested('foo') // false
 * isNested('foo.bar') // true
 * isNested('foo\\.bar') // false
 * isNested('foo\\.bar.qux') // true
 * @param {String} path Path to check
 * @return {Boolean} `true` if the path is nested, otherwise `false`.
 */
function isNested (path) {
    if (!path || typeof path !== 'string') {
        return false;
    }

    for (let i = 0; i < path.length; ++i) {
        if (path[i] === '.' && path[i - 1] !== '\\') {
            return true;
        }
    }

    return false;
}

module.exports = isNested;
