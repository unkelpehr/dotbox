'use strict';

const flags = {};

flags.KEEPR = 2;
flags.WRITE = 4;
flags.DMERGE = 8;
flags.SMERGE = 16;

flags.parse = bitmask => {
    return {
        KEEPR: !!(bitmask & flags.KEEPR),
        WRITE: !!(bitmask & flags.WRITE),
        DMERGE: !!(bitmask & flags.DMERGE),
        SMERGE: !!(bitmask & flags.SMERGE),
    };
};

Object.freeze(flags);

module.exports = flags;
