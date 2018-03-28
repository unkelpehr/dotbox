'use strict';

const isPlainObject = require('./isPlainObject');

function normalize (source, target) {
	target = target || {};

	sourceProps:
	for (const newKey in source) {
		// 'a': 1
		// 'a': 2
		if (target[newKey] !== undefined) {
			target[newKey] = source[newKey];
			continue;
		}

		for (const oldKey in target) {
			const newVal = source[newKey];
			const oldVal = target[oldKey];

			// 'a': 1
			// 'a.b': 1
			if (newKey.startsWith(oldKey)) {
				// console.log(`Old path ${oldKey} is a parent of ${newKey}`);

				if (!isPlainObject(oldVal)) {
					delete target[oldKey];	// Delete {'a': 1}
				}

				target[newKey] = newVal;	// Set {'a.b': 1}

				continue sourceProps;
			}

			// 'a.b': 1
			// 'a': 1
			else if (oldKey.startsWith(newKey)) {
				// console.log(`New path ${newKey} is a parent of ${oldKey}`);

				delete target[oldKey];		// Delete {'a.b': 1}
				target[newKey] = newVal;	// Set {'a': 1}
				
				continue sourceProps;
			}
		}

		// 'a': 1
		// 'b': 2
		target[newKey] = source[newKey];
	}

	return target;
}

module.exports = normalize;
