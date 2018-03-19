'use strict';

const util = require('util');
const debuglog = util.debuglog('dotbox');

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

function isEmptyObject (object) {
	if (object) {
		for (const key in object) {
			if (object.hasOwnProperty(key)) {
				return false
			}
		}
	}

	return true
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

		if (!_clone || !changes) {
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

		if (!_clone || !written) {
			return written;
		}

		return clone(written);
	}

	/**
	 * TODO.
	 * @return {Array}
	 */
	getChangedKeys (path) {
		const changes = this.data.changes;

		if (!changes) {
			return [];
		}

		const keys = Object.keys(changes);
		const finalKeys = {};
		
		if (path && path[path.length - 1] !== '.') {
			path += '.';
		}

		keys.forEach(key => {
			if (path) {
				key = key.replace(path, '');
			} else {
				const idx = key.indexOf('.');
				key = ~idx ? key.slice(0, idx) : key;
			}

			finalKeys[key] = 1;
		});

		return Object.keys(finalKeys);
	}

	/**
	 * TODO.
	 * @return {Array}
	 */
	getWrittenKeys (path) {
		const written = this.data.written;

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
		const written = this.getWritten();
		const changes = this.getChanges();

		if (!changes) {
			return written || {};
		}

		if (!written) {
			const result = {};

			Object.keys(changes).sort().map(key => {
				const segments = key.split('.');

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
				let i = 0;
				while (i++ < segments.length) {
					if (!result[segments[i]]) {
						const parentPath = segments.slice(0, i).join('.');
						const childPath = segments.slice(i).join('.');

						// data.changes = {};
						// db.set('a.b', 1);
						if (!result[parentPath]) {
							result[parentPath] = {
								old: undefined,
								new: !childPath ? changes[key] : dotProp.set({}, childPath, changes[key])
							};

							break;
						}

						// data.changes = {};
						// db.set('a.b', 1);
						// db.set('a.c', 1); <- parent `a` already exists
						dotProp.set(result[parentPath].new, childPath, changes[key]);
						break;
					}
				}
			});

			return result;
		}


		if (0) {
			const result = written;

			Object.keys(changes).forEach(key => {
				dotProp.set(result, key, {
					old: dotProp.get(written, key),
					new: changes[key]
				});
			});

			return result;
		}

		if (1) {
			const result = this.getWritten();

			const isFullChange = {};

			Object.keys(changes).forEach(key => {
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

					return;
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
			});

			return result;
		}

		const result = {};
		const writtenKeys = Object.keys(written);
		const changedKeys = Object.keys(changes);

		writtenKeys.forEach(writtenKey => {

			changedKeys.forEach(changedKey => {
				if (changedKey.indexOf(writtenKey + '.') === 0) {
					debuglog(`DIFF '${changedKey}' is a child of the existing key '${writtenKey}'`);

					if (!result[writtenKey]) {
						result[writtenKey] = {
							old: written[writtenKey],
							new: {}
						}
					}

					dotProp.set(
						result[writtenKey].new,
						changedKey.replace(writtenKey + '.', ''),
						changes[changedKey]
					);
				}
			});

			if (!result[writtenKey]) {
				result[writtenKey] = written[writtenKey];
			}
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
			data.changes = source;
			//data.changes = patch({}, source);
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
			const target = data.changes;

			const targetKeys = Object.keys(target);
			const sourceKeys = Object.keys(source);

			sourceKeys.forEach(sourceKey => {
				
				if (target[sourceKey]) {
					debuglog(`SET There is an existing property on this path (${sourceKey})`);

					if (deepMerge && isPlainObject(target[sourceKey]) && isPlainObject(source[sourceKey])) {
						// Deep merge source[sourceKey] into target[sourceKey];
						return;
					}
					
					target[sourceKey] = source[sourceKey];
					return;
				}

				targetKeys.forEach(targetKey => {
					const sourceVal = source[sourceKey];
					const targetVal = target[targetKey];

					if (targetKey.indexOf(sourceKey + '.') === 0) {
						debuglog(`SET Existing property '${targetKey}' is a child of the new property '${sourceKey}'`);

						if (isPlainObject(sourceVal)) { // The new value is a plain object
							
							if (isEmptyObject(sourceVal)) { // The new value is an empty, plain object
								// set('a.b', 1)
								// set('a', {})
								delete target[targetKey];
								target[sourceKey] = {};
							} else {
								target[sourceKey] = sourceVal;
								dotProp.set(target, targetKey, targetVal);
								delete target[targetKey];
							}
						} else {
							debuglog(`SET Overwriting non-plain-object on path '${targetKey}' to set '${sourceKey}'`);
							delete target[targetKey];

							if (deepMerge) {
								target[sourceKey] = sourceVal;
							} else {
								dotProp.set(target, sourceKey, sourceVal);
							}
						}

					} else if (sourceKey.indexOf(targetKey + '.') === 0) {
						debuglog(`SET New property '${sourceKey}' is a child of the existing property '${targetKey}'`);

						if (isPlainObject(targetVal)) {
							debuglog(`SET Reusing plain-object on path '${targetKey}' to set '${sourceKey}'`);

							dotProp.set(targetVal, sourceKey.replace(targetKey + '.', ''), sourceVal);
							// dotProp.set(target, sourceKey, sourceVal);
						} else {
							debuglog(`SET Overwriting non-plain-object on path '${targetKey}' to set '${sourceKey}'`);

								delete target[targetKey];
							
							if (deepMerge) {
								target[sourceKey] = sourceVal;
							} else {
								dotProp.set(target, sourceKey, sourceVal);
							}

						}
					} else {
						// debuglog(`SET Independent property '${sourceKey}' introduced`);
						target[sourceKey] = source[sourceKey];
					}
				});
		
			});

			//dotProp.set(data.changes, key, source[key]);
			// data.changes[key] = source[key];
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
				patch(data.merged, clone(data.written));
				patch(data.merged, clone(data.changes));
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
		console.log(util.inspect(obj || this.data, {depth: null, colors: true, breakLength: 2}), '\n');
	}
}

module.exports = MemoryDatabase;
