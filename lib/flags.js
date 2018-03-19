'use strict';

const flags = {};

flags.DONT_CLONE = 1;
flags.DEEP_MERGE = 2;
flags.AS_WRITTEN = 4;
flags.DEEP_MERGE = 8; // TODO.
flags.DEREFERENCE = 16; // TODO. Kanske bättre än "clone"? Fimpa alla referenser men klona inte datum, buffrar osv

Object.freeze(flags);

module.exports = flags;
