'use strict';

const util = require('util');

const flags = require('./flags');
const extend = require('./extend');
const patch = require('./patch');
const dotProp = require('dot-prop');
const isPlainObject = require('./isPlainObject');

const kDeep = Symbol('Deep merge');

const dotbox = {
	normalize: require('./normalize')
};

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
class DotBox {
	/**
	 * Constrcutor.
	 * @param {String} name
	 */
	constructor (name) {
		const data = this.data = {};

		this.name = name;

		data.written = {};
		data.changelog = [];

		data.merged = null;
		data.normalizedChanges = null;

		Object.assign(this, flags);

		Object.defineProperty(this, 'cache', {
			value: {
				changes: {},
				merged: {}
			}
		});
	}

	get changes () {
		const cache = this.cache;

		if (cache.changes) {
			return cache.changes;
		}

		const target = cache.changes = {};
		const changelog = this.data.changelog;

		for (let i = 0; i < changelog.length; ++i) {
			const source = changelog[i];
			const isDeep = source[kDeep] === true;

			dotbox.normalize(source, target);
		}

		return cache.changes;
	}

	/**
	 * @type {Boolean} TRUE if this document has unsaved changes. Otherwise FALSE.
	 */
	get hasChanges () {
		return this.data.changelog.length > 0;
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
	getChanges (normalize=true, dereference=true) {
		const data = this.data;
		const changes = this.data.changelog;
		const deref = dereference ? extend : val => val;

		if (!changes.length) {
			return normalize ? {} : [];
		}

		if (!normalize) {
			return deref(changes);
		}

		if (!data.normalizedChanges) {
			const target = data.normalizedChanges = {};

			for (let i = 0; i < changes.length; ++i) {
				const source = changes[i];
				const isDeep = source[kDeep] === true;

				dotbox.normalize(source, target);
			}
		}

		return deref(data.normalizedChanges);
	}

	/**
	 * TODO.
	 * @param {Bool} [dereference=true]
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

		const keys = [];
		const changes = this.getChanges();

		for (const key in changes) {
			if (!path) {
				keys.push(getRoot(key))
			} else {
				if (key.startsWith(path)) {
					keys.push(key.substr(path.length));
				}
			}
		}

		return keys;
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
	
	/**
	 * Set.
	 * TODO: set('foo') should throw typeerror
	 * @param {Bool|Integer|Undefined} bitmask
	 * @param {String|Object} key
	 * @param {Mixed|Undefined} val
	 */
	set (bitmask, key, val) {
		const data = this.data;

		// set([true, false])
		if (bitmask !== +bitmask) {
			if (bitmask === true) {
				bitmask = flags.DEEP_MERGE;
			} else if (bitmask === false) {
				bitmask = 0;
			} else {
				// set(keyVal);
				val = key;
				key = bitmask;
				bitmask = 0;
			}
		}

		const typeofKey = typeof key;
		const deepMerge = !!(bitmask & flags.DEEP_MERGE);
		const asWritten = !!(bitmask & flags.AS_WRITTEN);
		
		// Normalize [key, val] into `source`: {key: val}
		let source;

		if (typeofKey === 'object') {
			// set({'a.b': 1})
			source = extend(key);
		} else if (typeofKey !== 'string') {
			throw new TypeError(`usage: dotbox.set( [bitmask=boolean|integer, ](key, val|{key:val}) ), got "${[].slice.call(arguments)}"`);
		} else {
			// set('a.b', 1)
			source = {};
			source[key] = extend(val);
		}

		// Reset the written/changes merge as it's now outdated.
		data.merged = null;

		if (asWritten) {
			patch(deepMerge, data.written, source);
		} else {
			// Reset the 'normalizedChanges' as it's now outdated.
			data.normalizedChanges = null;

			// Remember deepMerge-state.
			if (deepMerge) {
				source[kDeep] = deepMerge;
			}

			data.changelog.push(source);
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

		if (!includeChanges || !data.changelog.length) {
			data = data.written;
		} else {
			// Build the `data.merged`-property on demand,
			// instead of doing it on each `set`-operation.
			if (!data.merged) {
				data.merged = extend(data.written);

				for (let i = 0; i < data.changelog.length; ++i) {
					const source = data.changelog[i];
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
			const changes = this.getChanges();

			if (this.hasWrites) {
				patch(data.written, changes);
			}

			data.changelog = [];
			data.merged = null;
			data.normalizedChanges = null;
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

module.exports = DotBox;
