'use strict';

exports.Database = require('./lib/Database');
exports.make = (...args) => new exports.Database(...args);
exports.flags = require('./lib/flags');

Object.assign(exports, exports.flags);
