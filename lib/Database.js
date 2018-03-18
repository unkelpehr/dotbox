'use strict';

const util = require('util');

const dotProp = require('dot-prop');

const clone = require('./clone');
const assign = require('./copy');
const flags = require('./flags');
const dottify = require('./dottify');
const isPlainObject = require('./isPlainObject');

/**
 * TODO.
 * @param {Object} target
 * @param {Object} source
 * @param {Object} debug
 * @return {Object}
 */
function patch (target, source, debug) {
	if (!source) {
		return;
	}

	const keys = Object.keys(source);

	let idx;
	let key;
	let val;

	for (idx = 0; idx < keys.length; ++idx) {
		key = keys[idx];
		dotProp.set(target, key, source[key]);
	}

	return target;
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

		data.merged = undefined;
		data.written = undefined;
		data.changes = undefined;

		Object.assign(this, flags);
	}

	/**
	 * @type {Boolean} TRUE if this document has unsaved changes. Otherwise FALSE.
	 */
	get isDirty () {
		return !!this.data.changes;
	}

	/**
	 * @type {Boolean} TRUE if this document has been written to the database. Otherwise FALSE.
	 */
	get isSaved () {
		return !!this.data.written;
	}

	/**
	 * TODO.
	 * @param {Boolean} [_clone=true]
	 * @return {Object|null}
	 */
	getChanges (_clone=true) {
		const changes = this.data.changes;

		if (!clone || !changes) {
			return changes;
		}

		return clone(changes);
	}

	/**
	 * TODO.
	 * @param {Boolean} [_clone=true]
	 * @return {Object|null}
	 */
	getWritten (_clone = true) {
		const written = this.data.written;

		if (!clone || !written) {
			return written;
		}

		return clone(written);
	}

	/**
	 * TODO.
	 * @return {Object}
	 */
	diff () {
		const written = this.getWritten();
		const changes = this.getChanges();

		if (!changes) {
			return written || {};
		}

		if (!written) {
			const result = {};

			Object.keys(changes).map(key => {
				result[key] = {
					old: undefined,
					new: changes[key]
				};
			});

			return result;
		}

		const result = this.getWritten();

		Object.keys(changes).forEach(key => {
			dotProp.set(result, key, {
				old: dotProp.get(written, key),
				new: changes[key]
			});
		});

		return result;
	}

	/**
	 * Return the value with the key `key`, as previously set via the `set`-method.
	 * The `includeChanges` parameter is an optional setting (being `true` as default)
	 * which prioritizes (and includes) local (dirty) values.
	 * @param {Boolean} [bitmask=]
	 * @param {String} key
	 * @param {String} val
	 * @return {Mixed}
	 */
	set (bitmask, key, val) {
		const data = this.data;

		let source;
		let target;

		// Handle case when bitmask is not a number;
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

		const dontClone = (bitmask & flags.DONT_CLONE);
		const deepMerge = (bitmask & flags.DEEP_MERGE);
		const asWritten = (bitmask & flags.AS_WRITTEN);

		source = clone(source);

		// Case 1:
		// Set data as 'written' on an empty target.
		if (asWritten && !data.written) {
			data.written = patch({}, source);
			return this;
		}

		// Case 2:
		// Set data as 'changes' on an empty target.
		if (!asWritten && !data.changes) {
			data.changes = patch({}, source);
			return this;
		}

		// Case 3:
		// Deep merge data as 'changes' on a non-empty target.
		if (!asWritten && deepMerge) {
			dottify(source, data.changes);
			return this;
		}

		// Case 4:
		// Shallow merge data as 'changes' on a non-empty target.
		if (!asWritten && !deepMerge) {
			Object.keys(source).forEach(key => {
				dotProp.set(data.changes, key, source[key]);
			});

			return this;
		}

		const keys = Object.keys(source);

		let idx = 0;
		let len = keys.length;

		for (; idx < len; ++idx) {
			const key = keys[idx];
			const val = source[key];

			if (asWritten) {
				if (deepMerge && isPlainObject(val)) {
					dotProp.set(data.written, key, {});
					assign(deepMerge, dotProp.get(data.written, key), source[key]);
				} else {
					dotProp.set(data.written, key, val);
				}
			} else {
				// data.changes[key] = val;
				dotProp.set(data.changes, key, val);
			}
		}

		// Reset the written/changes merge as it's now outdated.
		data.merged = undefined;

		return this;
	}

	/**
	 * Return the value with the key `key`, as previously set via the `set`-method.
	 * The `includeChanges` parameter is an optional setting (being `true` as default)
	 * which prioritizes (and includes) local (dirty) values.
	 * @param {Boolean} [includeChanges=true]
	 * @param {String} key
	 * @return {Mixed}
	 */
	get (includeChanges, key) {
		let data = this.data;

		// Optional parameter 'includeChanges'
		if (includeChanges !== true && includeChanges !== false) {
			key = includeChanges;
			includeChanges = true;
		}

		if (!includeChanges || !data.changes) {
			data = data.written;
		} else {
			// Build the `data.merged`-property on demand,
			// instead of doing it on each `set`-operation.
			if (!data.merged) {
				data.merged = {};
				patch(data.merged, data.written);
				patch(data.merged, data.changes);
			}

			data = data.merged;
		}

		// Retrieve everything
		if (key === undefined) {
			return clone(data);
		}

		return dotProp.get(data, key);
	}

	/**
	 * Internal method that merges all set changes with
	 * the 'written' data on this document.
	 */
	_writeChanges () {
		const data = this.data;

		if (data.changes) {
			return;
		}

		if (!data.written) {
			data.written = {};
		}

		patch(data.written, data.changes);
		data.changes = undefined;
	}

	/**
	 * Save.
	 */
	async save () {

	}

	/**
	 * Inspect.
	 * @param {Object} [obj=`this.data`]
	 */
	_inspect (obj) {
		console.log('\nInspect:', util.inspect(obj || this.data, {depth: null, colors: true, breakLength: 0}));
	}
}

module.exports = MemoryDatabase;
