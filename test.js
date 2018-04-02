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

const flatten = require('./lib/flatten');

const db = dotbox.createDocument();

db.set('a.b.c', {});
db.set('a.b.c.d', 2);
db.set('a.b.c.e', 3);
db.set('a.b.c.f', {
	g: 4,
	h: 5
});

//db.set(dotbox.DMERGE, 'a.b.c', {});

// db.set('jobo18', {
// 	names: {
// 		first: 'Jonas',
// 		last: 'Boman',
// 	}
// });

// db.set({
// 	'jobo18.names.nickname1': 'upehr',
// 	'jobo18.names.nickname2': 'upehr2',
// });


dotbox._inspect({
	changes: db.changes,
	// get: db.get(),
});


return;
dotbox._inspect(flatten(1, {
	a: 'a',
	b: {
		c: 1,
		d: {
			e: {
				f: 1,
				g: 2,
				h: 3
			},

			f: 2,
			g: 3
		}
	},
	c: {
		d: {
			e: {
				f: 1
			}
		}
	},
	d: {
		e: {
			f: {
				g: 1,
				h: {
					i: 1,
					j: 2
				}
			}
		}
	}
}));

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

// const db = dotbox.createDocument();

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