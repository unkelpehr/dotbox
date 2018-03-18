'use strict';

const walk = require('./lib/walk');
const data = require('./data');

const define = (obj, key, val) => {
    Object.defineProperty(obj, key, {value: val});
};

function get (explicit, filter) {
    const datatypes = {};

    if (explicit !== true && explicit !== false) {
        filter = explicit;
        explicit = true;
    }

    data._each(explicit, filter, val => {
        const props = val.getProperties(explicit, filter);

        if (!props) {
            return; // Everything filtered out
        }

        if (props.error) {
            return; // Ouch
        }
        
        datatypes[val.name] = props;
    });

    // Set 'walk' as a non-enumerable property.
    Object.defineProperty(datatypes, 'walk', {
        value: walk
    });
    
    Object.defineProperty(datatypes, 'get', {
        value: function (path) {
            var segments = path.split('.');
            var parent = datatypes[segments[0]];

            if (segments.length === 0) {
                return parent;
            }
            
            if (!parent) {
                return;
            }

            return parent[segments[1]];
        }
    });

    // Fill the 'array.filledWithEverything' array with every type of value.
    if (datatypes.Array && datatypes.Array.filledWithEverything) {
        datatypes.walk((val, key, parent, path) => {
            datatypes.Array.filledWithEverything.push(val);
        });
    }

    // Fill the 'arguments.filledWithEverything' arguments object with every type of value.
    if (datatypes.Arguments && datatypes.Arguments.filledWithEverything) {
        datatypes.Arguments.filledWithEverything = (function () {
            var values = [];
    
            datatypes.walk((val, key, parentObject, path) => {
                if (path.indexOf('Arguments') !== 0) {
                    values.push(val);
                }
            });
    
            return (function () {
                return arguments;
            }.apply(null, values))
        }());
    }
    
    return datatypes;
}

module.exports = {get};
