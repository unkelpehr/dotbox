'use strict';

const flags = module.exports = {};

flags.extend = target => {
    target.KEEPR = 2;
    target.WRITE = 4;
    target.DMERGE = 8;
    target.SMERGE = 16;
};

flags.parse = bitmask => {
    return {
        KEEPR: !!(bitmask & flags.KEEPR),
        WRITE: !!(bitmask & flags.WRITE),
        DMERGE: !!(bitmask & flags.DMERGE),
        SMERGE: !!(bitmask & flags.SMERGE),
    };
};

flags.extend(flags);