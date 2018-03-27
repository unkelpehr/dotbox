'use strict';

const dotbox = {
	flags: require('./flags'),
	extend: require('./extend'),
	patch: require('./patch'),
	get: require('./get'),
	normalize: require('./normalize'),
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
		const queue = this.queue;

		let i = 0;
		for (; i < queue.length; ++i) {
			const change = queue[i];
			const source = change.data;

			dotbox.normalize(source, target);
		}

		if (i === 0) {
			cache.changes = null;
		}

		return cache.changes;
	},
	
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
		opts.data = dotbox.extend(opts.data);

		// Parse the bitmask into easy-to-access flagN: boolN.
		opts.flags = dotbox.flags.parse(opts.bitmask);

		// At this point everything we need to know is neatly
		// tucked away in the `opts` object.
		
		// Reset the written/changes merge as it's now outdated.
		cache.merged = null;

		if (opts.flags.WRITE) {
			if (!this.written) {
				this.written = {};
			}

			dotbox.patch(opts.bitmask, this.written, opts.data);

			return this;
		}

		// Reset the `changes` cache as it's now outdated.
		cache.changes = null;

		// Await `save`.
		this.queue.push(opts);

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
		const queue = this.queue;
		const writes = this.written;

		// Optional parameter 'includeChanges'
		if (includeChanges !== true && includeChanges !== false) {
			path = includeChanges;
			includeChanges = true;
		}

		let data;

		if (!includeChanges || !queue.length) {
			data = writes;
		} else {
			// Build the `data.merged`-property on demand,
			// instead of doing it on each `set`-operation.
			if (!cache.merged) {
				cache.merged = dotbox.extend(writes);

				for (let i = 0; i < queue.length; ++i) {
					const change = queue[i];
					
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
	 * Merges all queued up changes with the `written` data property and clears the queue.
	 * @return {Object} `this`
	 */
	save () {
		const cache = this.cache;
		const written = this.written;
		const queue = this.queue;

		if (!written) {
			written = this.written = {};
		}

		for (let i = 0; i < queue.length; ++i) {
			const change = queue[i];

			dotbox.patch(change.bitmask, written, change.data);
		}

		queue.length = 0;

		cache.merged = null;
		cache.changes = null;

		return this;
	},
};

Object.assign(proto, dotbox.flags);

module.exports = opts => {
	const properties = {
		written: {
			writable: true,
			value: null,
		},

		queue: {
			writable: true,
			value: []
		},

		cache: {
			value: {
				changes: null,
				merged: null
			}
		}
	};

	return Object.create(proto, properties);
};
