'use strict';

/**
 * Splits given `path` into an array of strings containing each segment.
 * Segments escaped with a \ backslash are concatenated.
 * 
 * @example
 * dotbox.getSegments('aaa.bbb.ccc'); // ['aaa', 'bbb', 'ccc']
 * dotbox.getSegments('aaa\\.bbb.ccc'); // ['aaa\\.bbb', 'ccc']
 * dotbox.getSegments('aaa\\.bbb\\.ccc'); // ['aaa\\.bbb\\.ccc']
 * @param {String} path The path to parse.
 * @return {Array} An Array of strings split at each point where an unescaped dot occurs in the given string.
 */
function getSegments (path) {
    const parts = path.split('.');
    const segments = [];

    if (parts.length === 1 || path.indexOf('\\') === -1) {
        // Return empty array when given empty path.
        if (parts.length === 1 && !parts[0]) {
            return [];
        }

        return parts;
    }

    for (let i = 0; i < parts.length; i++) {
        let segment = parts[i];

        // `!==undefined` to accuratly match paths ending with an escaped dot;
        // getSegments('aaa.bbb.ccc\\.');
        while (segment[segment.length - 1] === '\\' && parts[i + 1] !== undefined) {
            segment += '.' + parts[++i];
        }

        segments.push(segment);
    }

    return segments;
}

module.exports = getSegments;
