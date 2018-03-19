'use strict';

const isPlainObject = require('./isPlainObject');

function getTestData() {
	return {
		fooA: {
			barA: {
				quxA: 'fooA.barA.quxA',
				quxB: 'fooA.barA.quxB',
				quxC: 'fooA.barA.quxC'
			},

			barB: {
				quxA: 'fooA.barB.quxA',
				quxB: 'fooA.barB.quxB',
				quxC: 'fooA.barB.quxC'
			},

			barC: {
				quxA: 'fooA.barC.quxA',
				quxB: 'fooA.barC.quxB',
				quxC: 'fooA.barC.quxC'
			},
		},

		fooB: {
			barA: {
				quxA: 'fooB.barA.quxA',
				quxB: 'fooB.barA.quxB',
				quxC: 'fooB.barA.quxC'
			},

			barB: {
				quxA: 'fooB.barB.quxA',
				quxB: 'fooB.barB.quxB',
				quxC: 'fooB.barB.quxC'
			},

			barC: {
				quxA: 'fooB.barC.quxA',
				quxB: 'fooB.barC.quxB',
				quxC: 'fooB.barC.quxC'
			},
		},

		fooC: {
			barA: {
				quxA: 'fooC.barA.quxA',
				quxB: 'fooC.barA.quxB',
				quxC: 'fooC.barA.quxC'
			},

			barB: {
				quxA: 'fooC.barB.quxA',
				quxB: 'fooC.barB.quxB',
				quxC: 'fooC.barB.quxC'
			},

			barC: {
				quxA: 'fooC.barC.quxA',
				quxB: 'fooC.barC.quxB',
				quxC: 'fooC.barC.quxC'
			},
		},
	};
}
function dereference (object, _target) {
	// No need to check that `object` is plain
	// if `_target` is set (or we'd be double-checking).
	if (!_target && !isPlainObject(object)) {
		return object;
	}

	const target = _target || {};

	for (const key in object) {
		const val = object[key];

		if (isPlainObject(val)) {
			target[key] = {};
			dereference(val, target[key]);
		} else {
			target[key] = val;
		}
	}

	return target;
}

const object = getTestData();

let times = 1000000;
console.time('dereference');
while (times--) {
	dereference(object);
}
console.timeEnd('dereference');
process.exit();
module.exports = dereference;
