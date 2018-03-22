'use strict';

function walk (callback, _object, _parentKey) {
    var object = _object || this;
    var parentKey = _parentKey ?  (_parentKey + '.') : '';

    Object.keys(object).forEach(key => {
        var val = object[key];
        var path = parentKey + key;
        
        // Only execute callback on nested props
        if (parentKey) {
            return callback(val, key, object, path);
        }
        
        walk(callback, val, path);
    });
}

module.exports = walk;
