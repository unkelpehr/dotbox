'use strict';

const isPlainObject = require('./isPlainObject');

function dereference (object, _target) {
	// No need to check that `object` is plain
	// if `_target` is set (or we'd be double-checking).
	if (!_target && !isPlainObject(object)) {
		return object;
	}

	const target = _target || {};

	for (const key in object) {
		const val = object[key];

		if (isPlainObject(val)) {
			dereference(val, target[key] = {});
		} else if (Array.isArray(val)) {
			for (let i = 0; i < val.length; ++i) {
				if (isPlainObject(val[i])) {
					dereference(val[i], val[i] = {});
				}
			}
		} else if (val !== undefined) {
			target[key] = val;
		}
	}

	return target;
}

module.exports = dereference;
