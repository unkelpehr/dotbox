'use strict';

const util = require('util');

const dotbox = {
	flags: require('./flags'),
	isNested: require('./isNested'),
	extend: require('./extend'),
	patch: require('./patch'),
	isPlainObject: require('./isPlainObject'),
	set: require('./set'),
	get: require('./get'),
	normalize: require('./normalize'),
	subdir: require('./subdir'),
};

const proto = {
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
			const change = changelog[i];
			const source = change.data;
			const isDeep = change.DMERGE;

			dotbox.normalize(source, target);
		}

		if (i === 0) {
			cache.changes = null;
		}

		return cache.changes;
	},

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
				keys.push(dotbox.subdir(key, 0, 1))
			} else {
				if (key.startsWith(path)) {
					keys.push(key.substr(path.length));
				}
			}
		}

		return keys;
	},

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
			const data = dotbox.get(written, path);

			if (!dotbox.isPlainObject(data)) {
				return [];
			}

			return Object.keys(data);
		}

		return Object.keys(written);
	},

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
				const root = dotbox.subdir(path, 0, 1);
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

					dotbox.set(
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
			const root = dotbox.subdir(key, 0, 1);

			// If this is a top level change, or if there isn't anything
			// written at the `root`, just set it.
			if (!dotbox.isNested(key) || !written[root]) {
				result[key] = {
					old: written[key],
					new: changes[key]
				};

				continue;
			}

			// Check (and cache) whether all properties under the `root` has been changed.
			if (isFullChange[root] === undefined) {
				isFullChange[root] = this.getChangedKeys(root).sort().toString() === this.getWrittenKeys(root).sort().toString();
			}

			if (!isFullChange[root]) {
				dotbox.set(result, key, {
					old: dotbox.get(written, key),
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
				if (!result[root] || !result[root].new) { // TODO. fixa!
					result[root] = {
						old: written[root],
						new: {}
					};
				}

				dotbox.set(
					result[root].new,
					key.replace(root + '.', ''),
					changes[key]
				);
			}
		}

		return result;
	},
	
	/**
	 * Set.
	 * TODO: set('foo') should throw typeerror
	 * @param {Bool|Integer|Undefined} bitmask
	 * @param {String|Object} key
	 * @param {Mixed|Undefined} val
	 */
	set (bitmask, key, val) {
		const cache = this.cache;

		// set([true, false])
		if (bitmask !== +bitmask) {
			if (bitmask === true) {
				bitmask = dotbox.flags.MERGE;
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

		const opts = {
			data: {},
			time: new Date().getTime(),
			bitmask: bitmask,
			SMERGE: !!(bitmask & dotbox.flags.SMERGE),
			DMERGE: !!(bitmask & dotbox.flags.DMERGE),
			WRITE: !!(bitmask & dotbox.flags.WRITE),
			KEEPR: !!(bitmask & dotbox.flags.KEEPR),
		};

		// Normalize [key, val] into `opts.data`: {key: val}
		if (typeofKey === 'object') {
			// set({'a.b': 1})
			opts.data = dotbox.extend(key);
		} else if (typeofKey !== 'string') {
			throw new TypeError(`usage: dotbox.set( [bitmask=boolean|integer, ](key, val|{key:val}) ), got "${[].slice.call(arguments)}"`);
		} else {
			// set('a.b', 1)
			opts.data = {};
			opts.data[key] = dotbox.extend(val);
		}

		// Reset the written/changes merge as it's now outdated.
		cache.merged = null;

		if (opts.WRITE) {
			if (!this.written) {
				this.written = {};
			}

			dotbox.patch(opts.bitmask, this.written, opts.data);
		} else {
			// Reset the `changes` cache as it's now outdated.
			cache.changes = null;

			// boom
			this.changelog.push(opts);
		}

		return this;
	},

	/**
	 * Return the value at the given `path`, as previously set via the `set`-method.
	 * The `includeChanges` parameter is an optional setting (being `true` as default)
	 * which prioritizes (and includes) local (unsaved) values.
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
				cache.merged = dotbox.extend(writes);

				for (let i = 0; i < changelog.length; ++i) {
					const change = changelog[i];
					
					dotbox.patch(change.bitmask, cache.merged, change.data);
				}
			}

			data = cache.merged;
		}

		// Retrieve everything
		if (!path) {
			return dotbox.extend(data);
		}

		return dotbox.extend(dotbox.get(data, path));
	},

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
				// TODO
				// dotbox.patch(written, changes);
			}

			changelog.length = 0;

			cache.merged = null;
			cache.changes = null;
		}

		return this;
	},
};

Object.assign(proto, dotbox.flags);

module.exports = opts => {
	return Object.create(proto, {
		written: {
			writable: true,
			value: null,
		},

		changelog: {
			writable: true,
			value: []
		},

		cache: {
			value: {
				changes: null,
				merged: null
			}
		}
	});
};
