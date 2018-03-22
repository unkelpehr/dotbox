'use strict';

const kSeen = Symbol('Circular reference guard');

const isArray = Array.isArray;
const isObject = require('./isPlainObject');
const define = Object.defineProperty;

function dereferenceArray (source, hasSeen, setSeen) {
	let idx = 0;

	const length = source.length;
	const target = new Array(length);

	for (; idx < length; ++idx) {
		const sourceVal = source[idx];

		if (isObject(sourceVal)) {
			target[idx] = extend({}, sourceVal, hasSeen, setSeen);
		} else if (isArray(sourceVal)) {
			target[idx] = dereferenceArray(sourceVal, hasSeen, setSeen);
		} else {
			target[idx] = sourceVal;
		}
	}

	return target;
}

function extend (_target, _source, hasSeen, setSeen) {
	const target = _target;
	const source = _source;

	for (const key in source) {

		const sourceVal = source[key];
		const targetVal = target[key];
		
		if (isObject(sourceVal)) {

			if (hasSeen(sourceVal)) {
				target[key] = sourceVal;
			} else {
				setSeen(sourceVal);

				if (isObject(targetVal)) {
					extend(targetVal, sourceVal, hasSeen, setSeen);
				} else {
					extend(target[key] = {}, sourceVal, hasSeen, setSeen);
				}
			}

		} else if (sourceVal !== undefined) {

			if (isArray(sourceVal)) {
				target[key] = dereferenceArray(sourceVal, hasSeen, setSeen);
			} else {
				target[key] = sourceVal;
			}

		}
	}

	return target;
}

module.exports = function (target, source) {
	const seen = [];

	const length = arguments.length;

	function forget () {
		for (let i = 0; i < seen.length; ++i) {
			delete seen[i][kSeen];
		}
	}

	function setSeen (object) {
		object[kSeen] = 1;
		seen.push(object);
	}

	function hasSeen (object) {
		return object[kSeen];
	}

	// Dereference
	// extend( value )
	if (length === 1) {
		if (isObject(target)) {
			const result = extend({}, target, hasSeen, setSeen);
			forget()
			return result;
		} else {
			return target;
		}
	}

	// extend( {}, falsy )
	if (!isObject(source)) {
		return target;
	}

	// extend( falsy, {} )
	if (!isObject(target)) {
		target = {};
	}
	// console.log('extend', {
	//     target,
	//     source
	// })
	extend(target, source, hasSeen, setSeen);

	forget();

	return target;
};

/* module.exports = (_target, _source) => {
	const seen = [];

	function setSeen (object) {
		object[kSeen] = 1;
	}

	function hasSeen (object) {
		return object[kSeen];
	}

	if (!isObject(_target)) {
		return _target;
	}

	const target = _source ? _target : {};
	const source = _source ? _source : _target;

	extend(target, source, hasSeen, setSeen);
	
	for (let i = 0, len = seen.length; i < len; ++i) {
		delete seen[i][kSeen];
	}

	return target;
};
 */