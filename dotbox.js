'use strict';

const dotbox = module.exports = {};

const fs = require('fs');
const util = require('util');
const path = require('path');
const lib = path.join(__dirname, 'lib');

fs.readdirSync(lib).forEach(file => {
    if (file[0] !== '_') {
        dotbox[file.replace(/\.[^/.]+$/, '')] = require(path.join(lib, file));
    }
});

dotbox._inspect = value => {
    console.log(util.inspect(value, {depth: null, colors: true, breakLength: 0}), '\n');
};

Object.assign(dotbox, dotbox.flags);
