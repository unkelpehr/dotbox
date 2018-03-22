'use strict';

const flags = {};

flags.KEEPR = 2;
flags.WRITE = 4;
flags.DMERGE = 8;
flags.SMERGE = 16;

Object.freeze(flags);

module.exports = flags;
