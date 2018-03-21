'use strict';

const util = require('util');
const debuglog = util.debuglog('dotbox');

const dotProp = require('dot-prop');

const assign = require('./copy');
const flags = require('./flags');
const dottify = require('./dottify');
const dereference = require('./dereference');
const extend = require('./extend');
const isPlainObject = require('./isPlainObject');

const patch = require('./patch');

const kDeep = Symbol('Deep merge');

function isEmptyObject (object) {
	if (object) {
		for (const key in object) {
			return false
		}
	}

	return true
}

function getRoot (path) {
	let i = 0;
	const len = path.length;

	for (; i < len; ++i) {
		if (path[i] === '.') {
			return path.substr(0, i);
		}
	}

	return path;
}

/**
 * Bla.
 */
class MemoryDatabase {
	/**
	 * Constrcutor.
	 * @param {String} name
	 */
	constructor (name) {
		const data = this.data = {};

		this.name = name;

		data.merged = null;
		data.written = {};
		data.changes = [];

		Object.assign(this, flags);
	}

	/**
	 * @type {Boolean} TRUE if this document has unsaved changes. Otherwise FALSE.
	 */
	get hasChanges () {
		return this.data.changes.length > 0;
	}

	/**
	 * @type {Boolean} TRUE if this document has been written to the database. Otherwise FALSE.
	 */
	get hasWrites () {
		const writes = this.data.written;

		for (const key in writes) {
			return true;
		}

		return false
	}

	/**
	 * TODO.
	 * @return {Object|null}
	 */
	/* getChanges (flatten=true) {
		const changes = this.data.changes;

		if (!changes) {
			return flatten ? [] : {};
		}

		if (!flatten) {
			return extend(changes);
		}

		const flattened = {};

		for (let i = 0; i < changes.length; ++i) {
			const source = changes[i];
			const isDeep = source[kDeep] === true;

			//patch(isDeep, flattened, source);
			for (const path in source) {
				const val = source[path];

				flattened[path] = val;
			}
		}

		return extend({}, flattened);
	}
	
	getChanges (flatten=true) {
		const changes = this.data.changes;

		if (!changes) {
			return flatten ? [] : {};
		}

		if (!flatten) {
			return extend(changes);
		}

		const target = {};

		for (let i = 0; i < changes.length; ++i) {
			const source = changes[i];
			const isDeep = source[kDeep] === true;

			//patch(isDeep, target, source);
			outer: for (const sourceKey in source) {

				const newVal = source[sourceKey];

				for (const targetKey in target) {
					const newVal = source[sourceKey];
					const oldVal = target[targetKey];

					// set('a', 1);
					// set('a.b', 1);
					if (sourceKey.startsWith(targetKey)) {
						console.log(`${targetKey} is a parent for ${sourceKey}, it is a`, isPlainObject(oldVal) ? 'plain object' : 'value');

						if (isPlainObject(oldVal)) {
							// set('a.b', {});
							// set('a.b.c', 2);
							//target['a.b']['c'] = 2
							// dotProp.set(oldVal, sourceKey.substr(targetKey.length + 1), newVal);
							target[sourceKey] = newVal;
						} else {
							// set('a.b', 1);
							// set('a.b.c', 2);
							delete target[targetKey]; // Delete {'a.b': 1}
							target[sourceKey] = newVal;
							// dotProp.set(target, sourceKey, newVal); // Set {'a.b.c': 1}
						}

						continue outer;
					}

					// set('a', 1);
					// set('a.b', 1);
					else if (targetKey.startsWith(sourceKey)) {
						console.log(`${sourceKey} is a child of ${targetKey}`);

						delete target[targetKey]; // Delete {'a.b.c': 1}
						target[sourceKey] = newVal;
						// dotProp.set(target, sourceKey, newVal); // Set {'a.b': 1}
						continue outer;
					}
				}

				target[sourceKey] = source[sourceKey];
			}
		}

		return extend({}, target);
	}
	*/
	getChanges (filter=true) {
		const changes = this.data.changes;

		if (!changes.length) {
			return filter ? [] : {};
		}

		if (!filter) {
			return extend(changes);
		}

		const target = {};

		for (let i = 0; i < changes.length; ++i) {
			const source = changes[i];
			const isDeep = source[kDeep] === true;

			sourceProps:
			for (const newKey in source) {
				for (const oldKey in target) {
					const newVal = source[newKey];
					const oldVal = target[oldKey];

					// set('a', 1);
					// set('a.b', 1);
					if (newKey.startsWith(oldKey)) {
						console.log(`Old path ${oldKey} is a parent of ${newKey}`);

						if (!isPlainObject(oldVal)) {
							delete target[oldKey];
						}

						target[newKey] = newVal;

						continue sourceProps;
					}

					// set('a', 1);
					// set('a.b', 1);
					else if (oldKey.startsWith(newKey)) {
						console.log(`New path ${newKey} is a parent of ${oldKey}`);

						delete target[oldKey]; // Delete {'a.b.c': 1}
						target[newKey] = newVal;
						// dotProp.set(target, newKey, newVal); // Set {'a.b': 1}
						continue sourceProps;
					}
				}

				target[newKey] = source[newKey];
			}
		}

		return extend({}, target);
	}

	/**
	 * TODO.
	 * @return {Object|null}
	 */
	getWritten (dereference=true) {
		const written = this.data.written;

		if (!dereference) {
			return written;
		}

		return extend(written);
	}

	/**
	 * TODO.
	 * @return {Array}
	 */
	getChangedKeys (path) {
		if (!this.hasChanges) {
			return [];
		}
		
		if (path && path[path.length - 1] !== '.') {
			path += '.';
		}

		const keys = {};
		const changes = this.data.changes;

		// [
		// 	source1,
		// 	source2,
		// 	sourceN, ...
		// ]
		for (let i = 0; i < changes.length; ++i) {
			const source = changes[i];

			for (const key in source) {
				if (path) {
					keys[key.replace(path, '')] = 1;
				} else {
					keys[getRoot(key)] = 1;
				}
			}
		}

		return Object.keys(keys);
	}

	/**
	 * TODO.
	 * @return {Array}
	 */
	getWrittenKeys (path) {
		if (!this.hasWrites) {
			return [];
		}

		const written = this.data.written;

		if (path) {
			const data = dotProp.get(written, path);

			if (!isPlainObject(data)) {
				return [];
			}

			return Object.keys(data);
		}

		return Object.keys(written);
	}

	/**
	 * TODO.
	 * @return {Object}
	 */
	diff () {
		const written = this.getWritten();
		const changes = this.getChanges(false);

		if (!this.hasChanges) {
			return written || {};
		}

		if (!this.hasWrites) {
			const result = {};
			const changes = this.getChanges();
			
			for (const path in changes) {
				const firstDot = path.indexOf('.');
				const isNested = !!~firstDot;
				const rootKey = isNested ? path.slice(0, firstDot) : path;
				const value = changes[path]

				// If this is a top level change, just set it.
				if (!isNested) {
					result[path] = {
						old: undefined,
						new: value
					};

					continue;
				}

				if (!result[rootKey]) {
					result[rootKey] = {
						old: undefined,
						new: {}
					};
				}

				dotProp.set(
					result[rootKey].new,
					path.substr(rootKey.length + 1), 
					value
				);
			}

			return result;
		}

		const result = this.getWritten();

		const isFullChange = {};

		for (let i = 0; i < changes.length; ++i) {
			const source = changes[i];
			const isDeep = source[kDeep] === true;

			for (const key in source) {
				const firstDot = key.indexOf('.');
				const isNested = !!~firstDot;
				const rootKey = isNested ? key.slice(0, firstDot) : key;

				// If this is a top level change, or if there isn't anything
				// written at the `rootKey`, just set it.
				if (!isNested || !written[rootKey]) {
					result[key] = {
						old: written[key],
						new: source[key]
					};

					continue;
				}

				// Check (and cache) whether all properties under the `rootKey` has been changed.
				if (isFullChange[rootKey] === undefined) {
					isFullChange[rootKey] = this.getChangedKeys(rootKey).sort().toString() === this.getWrittenKeys(rootKey).sort().toString();
				}

				if (!isFullChange[rootKey]) {
					dotProp.set(result, key, {
						old: dotProp.get(written, key),
						new: source[key]
					});
				} else {
					// Flatten changes: 
					// db.set('a.b.c', 1) =>
					// {
					// 		a: {
					//			old: undefined,
					//			new: {b: {c: 1}}
					// 		}
					// }
					// 
					// Instead of:
					// {
					// 		a: {
					//			b: {
					//				c: {
					//					old: undefined,
					//					new: 1,
					//				}
					// 			}
					// 		}
					// }
					if (!result[rootKey] || !result[rootKey].new) { // TODO. fixa!
						result[rootKey] = {
							old: written[rootKey],
							new: {}
						};
					}

					dotProp.set(
						result[rootKey].new,
						key.replace(rootKey + '.', ''),
						source[key]
					);
				}
			}
		}

		return result;
	}
	
	set (bitmask, key, val) {
		const data = this.data;

		let source;

		// Handle case when bitmask is not a number:
		// set(true, keyVal);
		// set(false, keyVal);
		// set(keyVal);
		if (typeof bitmask !== 'number') {
			if (bitmask === true) {
				bitmask = flags.DEEP_MERGE;
			} else {
				if (bitmask !== false) {
					val = key;
					key = bitmask;
				}

				bitmask = 0;
			}
		}
		
		// Normalize [key, val] into `source` ({key: val})
		if (typeof key === 'object') {
			// set([bitmask, ]{keyN: valN})
			source = key;
		} else if (typeof key !== 'string') {
			throw new TypeError('Wot are y doin');
		} else {
			// set([bitmask, ]key, val)
			source = {};
			source[key] = val;
		}

		const dontClone = !!(bitmask & flags.DONT_CLONE);
		const deepMerge = !!(bitmask & flags.DEEP_MERGE);
		const asWritten = !!(bitmask & flags.AS_WRITTEN);

		source = dereference(source);

		// Reset the written/changes merge as it's now outdated.
		data.merged = null;

		if (asWritten) {
			patch(deepMerge, data.written, source);
		} else {
			if (deepMerge) {
				source[kDeep] = deepMerge;
			}

			data.changes.push(source);
		}

		return this;
	}

	/**
	 * Return the value at the given `path`, as previously set via the `set`-method.
	 * The `includeChanges` parameter is an optional setting (being `true` as default)
	 * which prioritizes (and includes) local (dirty) values.
	 * @param {Boolean} [includeChanges=true]
	 * @param {String} path
	 * @return {Mixed}
	 */
	get (includeChanges, path) {
		let data = this.data;

		// Optional parameter 'includeChanges'
		if (includeChanges !== true && includeChanges !== false) {
			path = includeChanges;
			includeChanges = true;
		}

		if (!includeChanges || !data.changes.length) {
			data = data.written;
		} else {
			// Build the `data.merged`-property on demand,
			// instead of doing it on each `set`-operation.
			if (!data.merged) {
				data.merged = extend(data.written);

				for (let i = 0; i < data.changes.length; ++i) {
					const source = data.changes[i];
					const isDeep = source[kDeep] === true;
					
					patch(isDeep, data.merged, source);
				}
			}

			data = data.merged;
		}

		// Retrieve everything
		if (!path) {
			return extend(data);
		}

		return extend(dotProp.get(data, path));
	}

	/**
	 * Save.
	 */
	save () {
		const data = this.data;

		if (this.hasChanges) {
			if (this.hasWrites) {
				patch(data.written, data.changes);
			}

			data.changes = [];
		}

		return this;
	}

	/**
	 * Inspect.
	 * @param {Object} [obj=`this.data`]
	 */
	_inspect (obj) {
		console.log(util.inspect(obj || this.data, {depth: null, colors: true, breakLength: 2}), '\n');
	}
}

module.exports = MemoryDatabase;
