'use strict';

const isPlainObject = require('./isPlainObject');

function normalize (source, target) {

    target = target || {};

    sourceProps:
    for (const newKey in source) {
        // set('a', 1)
        // set 'b', 2)
        if (target[newKey] !== undefined) {
            target[newKey] = source[newKey];
            continue;
        }

        for (const oldKey in target) {
            const newVal = source[newKey];
            const oldVal = target[oldKey];

            // set('a', 1);
            // set('a.b', 1);
            if (newKey.startsWith(oldKey)) {
                // console.log(`Old path ${oldKey} is a parent of ${newKey}`);

                if (!isPlainObject(oldVal)) {
                    delete target[oldKey];
                }

                target[newKey] = newVal;

                continue sourceProps;
            }

            // set('a', 1);
            // set('a.b', 1);
            else if (oldKey.startsWith(newKey)) {
                // console.log(`New path ${newKey} is a parent of ${oldKey}`);

                delete target[oldKey]; // Delete {'a.b.c': 1}
                target[newKey] = newVal;
                // dotProp.set(target, newKey, newVal); // Set {'a.b': 1}
                continue sourceProps;
            }
        }

        target[newKey] = source[newKey];
    }
}

module.exports = normalize;
