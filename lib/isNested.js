'use strict';

function isNested (path) {
    for (let i = 0; i < path.length; ++i) {
        if (path[i] === '.') { // && path[i - 1] !== '\\'
            return true;
        }
    }

    return false;
}

module.exports = isNested;
