'use strict';

const flags = {};

flags.KEEPR = 2;
flags.WRITE = 4;
flags.DMERGE = 8;
flags.SMERGE = 16;

function parseBitmask (bitmask) {
    return {
        KEEPR: !!(bitmask & flags.KEEPR),
        WRITE: !!(bitmask & flags.WRITE),
        DMERGE: !!(bitmask & flags.DMERGE),
        SMERGE: !!(bitmask & flags.SMERGE),
    };
}

Object.defineProperty(flags, 'parse', {
    value: parseBitmask
});

Object.freeze(flags);

module.exports = flags;
