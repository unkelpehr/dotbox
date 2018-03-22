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
	 */
	constructor () {
		this.written = null;
		this.changelog = [];

		Object.assign(this, flags);

		Object.defineProperty(this, 'cache', {
			value: {
				changes: null,
				merged: null
			}
		});
	}

	/**
	 * @type {Object|null}
	 */
	get changes () {
		const cache = this.cache;

		if (cache.changes) {
			return cache.changes;
		}
		
		const target = cache.changes = {};
		const changelog = this.changelog;

		let i = 0;
		for (; i < changelog.length; ++i) {
			const source = changelog[i];
			const isDeep = source[kDeep] === true;

			dotbox.normalize(source, target);
		}

		if (i === 0) {
			cache.changes = null;
		}

		return cache.changes;
	}

	/**
	 * TODO.
	 * @return {Array}
	 */
	getChangedKeys (path) {
		const changes = this.changes;

		if (!changes) {
			return [];
		}
		
		if (path && path[path.length - 1] !== '.') {
			path += '.';
		}

		const keys = [];

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
		const written = this.written;

		if (!written) {
			return [];
		}

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
		const written = this.get(false);
		const changes = this.changes;

		if (!changes) {
			return written || {};
		}

		if (!written) {
			const result = {};
			
			for (const path in changes) {
				const root = getRoot(path);
				const value = changes[path];

				// If this is a top level change, just set it.
				if (root === path) {
					result[path] = {
						old: undefined,
						new: value
					};
				} else {
					if (!result[root]) {
						result[root] = {
							old: undefined,
							new: {}
						};
					}

					dotProp.set(
						result[root].new,
						path.substr(root.length + 1),
						value
					);
				}
			}

			return result;
		}

		const result = this.get(false);

		const isFullChange = {};

		for (const key in changes) {
			const firstDot = key.indexOf('.');
			const isNested = !!~firstDot;
			const rootKey = isNested ? key.slice(0, firstDot) : key;

			// If this is a top level change, or if there isn't anything
			// written at the `rootKey`, just set it.
			if (!isNested || !written[rootKey]) {
				result[key] = {
					old: written[key],
					new: changes[key]
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
					new: changes[key]
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
					changes[key]
				);
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
		const cache = this.cache;

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
		cache.merged = null;

		if (asWritten) {
			if (!this.written) {
				this.written = {};
			}

			patch(deepMerge, this.written, source);
		} else {
			// Reset the `changes` cache as it's now outdated.
			cache.changes = null;

			// Remember deepMerge-state.
			if (deepMerge) {
				source[kDeep] = deepMerge;
			}

			this.changelog.push(source);
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
		const cache = this.cache;
		const changelog = this.changelog;
		const writes = this.written;

		// Optional parameter 'includeChanges'
		if (includeChanges !== true && includeChanges !== false) {
			path = includeChanges;
			includeChanges = true;
		}

		if (!includeChanges || !changelog.length) {
			data = writes;
		} else {
			// Build the `data.merged`-property on demand,
			// instead of doing it on each `set`-operation.
			if (!cache.merged) {
				cache.merged = extend(writes);

				for (let i = 0; i < changelog.length; ++i) {
					const source = changelog[i];
					const isDeep = source[kDeep] === true;
					
					patch(isDeep, cache.merged, source);
				}
			}

			data = cache.merged;
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
		const cache = this.cache;

		const written = this.written;
		const changes = this.changes;
		const changelog = this.changelog;

		if (changes) {
			if (written) {
				patch(written, changes);
			}

			changelog.length = 0;

			cache.merged = null;
			cache.changes = null;
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
