'use strict';

const flags = {};

flags.DONT_CLONE = 1;
flags.DEEP_MERGE = 2;
flags.AS_WRITTEN = 3;

Object.freeze(flags);

module.exports = flags;
