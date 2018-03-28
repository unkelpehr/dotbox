'use strict';

const Benchmark = require('benchmark');
const suite = new Benchmark.Suite;

const dotbox = require('./dotbox');

function getTestData() {
	const testData = {
		a: 'b',
		c: {
			d: { e: 'cde', f: 'cdf' },
			b: { c: { bla: 'blo' } }
		},
		c: {
			d: { e: 'cde', f: 'cdf' },
			b: { c: { bla: 'blo' } }
		},

		circFoo: {
			circBar: null
		},

		circFoo2: {},
		circFoo3: {},
		array: ['a', 'b', 'c', 'd'],
		circArray: []
	};

	testData.circFoo.circBar = testData.circFoo;

	testData.circFoo2.circFoo3 = testData.circFoo3;
	testData.circFoo3.circFoo2 = testData.circFoo2;

	return testData;
};

const normalize = require('./lib/normalize');

const isPlainObject = require('./lib/isPlainObject');

function normalize2 (source, target) {
	target = target || {};

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

	return target;
}

const object = {
//	rand1: 1,
//	rand2: 4,
	'a': {},
//	rand3: 5,
	'a.b.c': 1,
//	rand4: 6,
	a: 1,
	'a.b': 1
};

const db = dotbox.createDocument();

db.set(object);

dotbox._inspect(db.changes);

return;

suite.add('normalize1', () => {
	normalize(object);
});

suite.add('normalize2', () => {
	normalize2(object);
});

suite.on('cycle', function (event) {
	console.log(String(event.target));
});

suite.on('complete', function () {
	const fastest = this.filter('fastest')[0];
	const slowest = this.filter('slowest')[0];

	console.log('');
	console.log('Fastest is ' + this.filter('fastest').map('name'));

	if (slowest) {
		const perc = Math.round((((fastest.hz / slowest.hz) - 1) * 100) * 10) / 10;

		console.log(`${fastest.name} is ${perc}% faster than ${slowest.name}`);
	}
});

suite.run({ 'async': true });