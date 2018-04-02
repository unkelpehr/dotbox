'use strict';

const dotbox = {
	flags: require('./flags'),
	dereference: require('./dereference'),
	get: require('./get'),
	set: require('./set'),
	isPlainObject: require('./isPlainObject'),
	flatten: require('./flatten'),
};

const proto = {
	/**
	 * Set.
	 * TODO: set('foo') should throw typeerror
	 * @param {Integer} [bitmask=0]
	 * @param {String|Object} key
	 * @param {Mixed|Undefined} val
	 */
	set (bitmask, key, val) {
		const cache = this.cache;
		const length = arguments.length;

		const opts = {
			data: {},
			time: new Date().getTime(),
			bitmask: bitmask,
			flags: null
		};

		// Normalize parameters into `opts.data` and `opts.bitmask`.
		if (length === 1) {
			// set({key: val});
			opts.data = bitmask;
			opts.bitmask = 0;
		} else if (length === 2) {
			if (typeof bitmask === 'string') {
				// set(key, val);
				opts.data[bitmask] = key;
				opts.bitmask = 0;
			} else {
				// set(bitmask, {key: val});
				opts.data = key;
				opts.bitmask = +bitmask;
			}
		} else {
			// set(bitmask, key, val);
			opts.data[key] = val;
		}

		// Destroy all the data references, so that we
		// don't risk internal data being changed by accident
		// outside of this method/document.
		opts.data = dotbox.dereference(opts.data);

		// Parse the bitmask into easy-to-access flagN: boolN.
		opts.flags = dotbox.flags.parse(opts.bitmask);

		// At this point everything we need to know is neatly
		// tucked away in the `opts` object.
		
		// Reset the written/changes merge as it's now outdated.
		cache.merged = null;

		// Write. Set the new data immediately on `this.written`.
		if (opts.flags.WRITE) {
			if (!this.written) {
				this.written = {};
			}

			dotbox.set(opts.bitmask, this.written, opts.data);

			return this;
		}

		// Change. Do something else.
		if (!this.changes) {
			this.changes = {};
		}

		// Input		'a.b.c':				{ d: { e: 1, f: {g: { h: 1, i: 2 } } } }
		// Replace		'a.b.c':				{ d: { e: 1, f: {g: { h: 1, i: 2 } } } }
		// Shallow:		'a.b.c[.d]':			{ e: 1, f: {g: { h: 1, i: 2 } } }
		// Deep:		'a.b.c[.d.e.f.g.h]':	1
		// 				'a.b.c[.d.e.f.g.i]':	2
		const depth = (opts.flags.SMERGE && 1) || (opts.flags.DMERGE && Infinity) || 0;

		const target = this.changes;
		const source = dotbox.flatten(depth, opts.data);

		// const targetKeys = Object.keys(target).sort();

		sourceProps:
		for (const newKey in source) {
			// 'a': *
			// 'a': *
			if (target[newKey] !== undefined) {
				//console.log('Fast overwrite', newKey);
				target[newKey] = source[newKey];
				continue;
			}

			//for (let i = 0; i < targetKeys.length; ++i) {
			for (const oldKey in target) {
				//const oldKey = targetKeys[i];
				const newVal = source[newKey];
				const oldVal = target[oldKey];

				// 'a': *
				// 'a.b': *
				if (newKey.startsWith(oldKey)) {
					console.log(`Old path ${oldKey} is a parent of ${newKey}`);

					if (!dotbox.isPlainObject(oldVal)) {
						delete target[oldKey];		// Delete {'a': *}
						target[newKey] = newVal;	// Set {'a.b': *}
					} else {
						// Set {'a': {b: *}}
						dotbox.set(oldVal, newKey.substr(oldKey.length + 1), newVal);
					}

					continue sourceProps;
				}

				// 'a.b': *
				// 'a': *
				else if (oldKey.startsWith(newKey)) {
					console.log(`New path ${newKey} is a parent of ${oldKey}`);

					delete target[oldKey];		// Delete {'a.b': *}
					target[newKey] = newVal;	// Set {'a': *}
					// continue sourceProps;
				}
			}

			// 'a': *
			// 'b': *
			target[newKey] = source[newKey];
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
		const cache = this.cache;
		const writes = this.written;
		const changes = this.changes;

		// Optional parameter 'includeChanges'
		if (includeChanges !== true && includeChanges !== false) {
			path = includeChanges;
			includeChanges = true;
		}

		let data;

		if (!includeChanges) {
			data = writes;
		} else {
			// Build the `data.merged`-property on demand,
			// instead of doing it on each `set`-operation.
			if (!cache.merged) {
				cache.merged = writes ? dotbox.dereference(writes): {};

				if (changes) {
					dotbox.set(cache.merged, changes);
				}
			}

			data = cache.merged;
		}

		// Retrieve everything
		if (!path) {
			return dotbox.dereference(data);
		}

		return dotbox.dereference(dotbox.get(data, path));
	},

	/**
	 * Merges all queued up changes with the `written` data property and clears the queue.
	 * @return {Object} `this`
	 */
	save () {
		const cache = this.cache;
		const written = this.written;
		const changes = this.changes;

		if (!changes) {
			return this;
		}

		if (cache.merged) {
			this.written = merged;
		} else {
			if (!written) { // `written` är en const, funkar ej.
				written = this.written = {};
			}

			dotbox.set(written, changes);
		}

		cache.merged = null;
		this.changes = null;

		return this;
	},

	/**
	 * Borde istället gå att:
	 * Object.keys(this.changes).sort();
	 * Sedan stanna loopen så fort `root` ändras.
	 * Kanske t.o.m. skapa ett nytt objekt istället för att delete'a
	 * från changes?
	 */
	resolveConflicts () {
		const changes = this.changes;

		if (!changes) {
			return this;
		}

		const target = {};
		const source = changes;

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

		this.changes = target;

		return this;
	}
};

Object.assign(proto, dotbox.flags);

module.exports = opts => {
	const properties = {
		written: {
			writable: true,
			value: null,
		},

		changes: {
			writable: true,
			value: null
		},

		cache: {
			value: {
				merged: null
			}
		}
	};

	return Object.create(proto, properties);
};
