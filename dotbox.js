'use strict';

const dotbox = module.exports = {};


dotbox.Database = require('./lib/Database');
dotbox.dottify = require('./lib/dottify');
dotbox.extend = require('./lib/extend');
dotbox.flags = require('./lib/flags');
dotbox.isPlainObject = require('./lib/isPlainObject');
dotbox.normalize = require('./lib/normalize');
dotbox.patch = require('./lib/patch');

dotbox.make = (...args) => new dotbox.Database(...args);

dotbox._inspect = value => {
    console.log(require('util').inspect(value, { depth: null, colors: true, breakLength: 2 }), '\n');
};

Object.assign(dotbox, dotbox.flags);
