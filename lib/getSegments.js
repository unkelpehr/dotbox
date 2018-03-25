'use strict';

function getSegments (path) {
    const parts = path.split('.');
    const segments = [];

    if (parts.length === 1 || path.indexOf('\\') === -1) {
        return parts;
    }

    for (let i = 0; i < parts.length; i++) {
        let segment = parts[i];

        while (segment[segment.length - 1] === '\\' && parts[i + 1]) {
            segment += '.' + parts[++i];
        }

        segments.push(segment);
    }

    return segments;
}

module.exports = getSegments;
