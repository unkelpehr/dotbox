'use strict';

const fs = require('fs');
const join = require('path').join;

const dir = join(__dirname, 'properties');

const data = module.exports = {};

function isFalsy (val) {
	return !val && val !== undefined;
}

fs.readdirSync(dir).forEach(file => {
	const name = file.slice(0, -3);
	const path = join(dir, file);

	if (name[0] === '_') {
		return;
	}

	data[name] = {name, path};

	let func;
	let error;

	try {
		func = new Function('module', [
			'try {',
			'var module = {exports: {}};',
			fs.readFileSync(path).toString(),
			'return module.exports;',
			'} catch (err) { return {error: err}; }'
		].join('\n'));
	} catch (err) {
		error = err;
	}
	
	data[name].getProperties = (explicit, filter) => {
		var props;
		var keys;
		var idx;
		var key;
		var path;

		if (error) {
			return {error: error};
		}

		if (filter && filter[name]) {
			explicit = false;
		}

		props = func();

		if (!filter || props.error) {
			return props;
		}

		keys = Object.keys(props);

		for (idx = 0; idx < keys.length; ++idx) {
			key = keys[idx];
			path = name + '.' + key;

			if (explicit && !filter[key]) {
				delete props[key];
			}
			
			if (!explicit && isFalsy(filter[path])) {
				delete props[key];
			}
		}

		return props;
	};
});

data._keys = Object.keys(data);
data._each = function (explicit, filter, iterator) {
	var keys = data._keys;
	var idx = 0;
	var key;

	filter = filter || {};

	for ( ; idx < keys.length; ++idx) {
		key = keys[idx];

		if (explicit && !filter[key]) {
			continue;
		}

		if (!explicit && isFalsy(filter[key])) {
			continue;
		}

		iterator(data[key])
	}
};
