'use strict';

function getSegments (path) {
    const segments = [];

    let i = 0;
    let last = 0;

    for (; i < path.length; ++i) {
        if (path[i] === '.' && path[i - 1] !== '\\') {
            segments.push(path.substring(last, i));
            last = i + 1;
        } else if (i === path.length - 1) {
            segments.push(path.substring(last));
        }
    }

    return segments;
}


console.log(getSegments('aaa.bbb.ccc\\.ddd.eee'));
process.exit();
module.exports = getSegments;
