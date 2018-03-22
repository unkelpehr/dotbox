'use strict';

const path = {};

// Bör kanske heta slice?
// path = foo.bar.qux
// (0, path) = foo
// (1, path) = bar
// (0, 2, path) = foo.bar
// (-1) qux
path.slice = (path, ...indexes) => {
    path.split('.').slice(...indexes)
};

// foo.bar.qux => qux
path.basename = path => {

};

// foo.bar.qux => foo.bar
path.dirname = path => {

};

// .foo..bar.qux => foo.bar.qux
path.normalize = path => {

};

module.exports = path;