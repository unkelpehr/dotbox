'use strict';

const dotbox = module.exports = {};


dotbox.Database = require('./lib/Database');
dotbox.dottify = require('./lib/dottify');
dotbox.extend = require('./lib/extend');
dotbox.flags = require('./lib/flags');
dotbox.isPlainObject = require('./lib/isPlainObject');
dotbox.normalize = require('./lib/normalize');
dotbox.patch = require('./lib/patch');
dotbox.createDocument2 = require('./lib/createDocument');

dotbox.make = (...args) => dotbox.createDocument2(...args);

dotbox._inspect = value => {
    console.log(require('util').inspect(value, { depth: null, colors: true, breakLength: 2 }), '\n');
};

dotbox.createDocument1 = opts => new dotbox.Database(opts);


Object.assign(dotbox, dotbox.flags);
