'use strict';

const Benchmark = require('benchmark');
const suite = new Benchmark.Suite;

const dotbox = require('./dotbox');
// const datatypes = require('./datatypes');

const db = dotbox.make('');
const db2 = dotbox.make('');
// const data2 = datatypes.get(false);

const isPlainObject = require('./lib/isPlainObject');
const patch = require('./lib/patch');

function getTestData () {
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

const dottify = require('./lib/dottify');
const dottify2 = require('./lib/dottify.1');

const testData = getTestData();

db._inspect(dottify(testData));
db._inspect(dottify2(testData));

suite.add('dottify1', () => {
	dottify(testData);
});

suite.add('dottify2', () => {
	dottify2(testData);
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

return;

db.set(db.AS_WRITTEN, {
	a: 0,
	b: 0,
	c: 0
});

db.set('a', 1);
db.set('b.c', 2);

db.set('c', {
	d: 1,
	e: 2,
	f: 3
});

db._inspect({
	written: db.getWritten(),
	changes: db.getChanges(),
	diff: db.diff(),
});

db.save();


db._inspect({
	written: db.getWritten(),
	changes: db.getChanges(),
	diff: db.diff(),
});

process.exit();

// Trigger write on empty storage (w/ derefence)
db.set(db.AS_WRITTEN, {
	a: 1,
	b: { c: null },
	c: 3
});

db.set(db.AS_WRITTEN, 'a.b', 2);	// Trigger recast of 'a' to object {b: 2}
db.set(db.AS_WRITTEN, 'b.c', 2);	// Trigger nested update on existing storage
db.set(db.AS_WRITTEN, 'd', 4); 		// Trigger new plain property
db.set(db.AS_WRITTEN, 'e.f', 5);	// Trigger new nested property

db.set('a', 1);		// Trigger change on empty storage
db.set('b', 1);		// Trigger change on non-empty storage
db.set('a', 2);		// Trigger overwrite of 'a' from 1 to 2

db.set('a.b', 3);		// Trigger recast of 'a' from 2 to {b: 3}
db.set('a.b.c', 4);	// Trigger nested recast of 'a.b' from 3 to {c: 4}

db.set('a.b', 5);		// Trigger recast of nested {b: c: 4} to 5
db.set('a', 6);		// Trigger recast of {a: b: 5} to 6

// Overwrite all written properties to 0
db.set('a.b', 0);
db.set('b.c', 0);
db.set({ c: 0, d: 0 });
db.set('e.f', 0);

db.set('b.d.e.f', 1);
db._inspect({
	//diff: db.diff(),
	keys: db.getChangedKeys('b'),
});
process.exit();

db.getChanges();		// Trigger normalization of changes
db.get();				// Trigger merge of written and changed data

db._inspect();

db.save();

db._inspect();

process.exit();

suite.add('db.set-original', () => {
	const db = dotbox.make('');

	// Trigger write on empty storage (w/ derefence)
	db.set2(db.AS_WRITTEN, {
		a: 1,
		b: {c: null},
		c: 3
	});

	db.set2(db.AS_WRITTEN, 'a.b', 2);	// Trigger recast of 'a' to object {b: 2}
	db.set2(db.AS_WRITTEN, 'b.c', 2);	// Trigger nested update on existing storage
	db.set2(db.AS_WRITTEN, 'd', 4); 		// Trigger new plain property
	db.set2(db.AS_WRITTEN, 'e.f', 5);	// Trigger new nested property

	db.set2('a', 1);		// Trigger change on empty storage
	db.set2('b', 1);		// Trigger change on non-empty storage
	db.set2('a', 2);		// Trigger overwrite of 'a' from 1 to 2
	
	db.set2('a.b', 3);		// Trigger recast of 'a' from 2 to {b: 3}
	db.set2('a.b.c', 4);	// Trigger nested recast of 'a.b' from 3 to {c: 4}
	
	db.set2('a.b', 5);		// Trigger recast of nested {b: c: 4} to 5
	db.set2('a', 6);		// Trigger recast of {a: b: 5} to 6

	// Overwrite all written properties to 0
	db.set2('a.b', 0);
	db.set2('b.c', 0);
	db.set2({c: 0, d: 0});
	db.set2('e.f', 0);

	db.getChanges();		// Trigger normalization of changes
	db.get();				// Trigger merge of written and changed data
});

suite.add('db.set-new', () => {
	const db = dotbox.make('');

	// Trigger write on empty storage (w/ derefence)
	db.set(db.AS_WRITTEN, {
		a: 1,
		b: {c: null},
		c: 3
	});

	db.set(db.AS_WRITTEN, 'a.b', 2);	// Trigger recast of 'a' to object {b: 2}
	db.set(db.AS_WRITTEN, 'b.c', 2);	// Trigger nested update on existing storage
	db.set(db.AS_WRITTEN, 'd', 4); 		// Trigger new plain property
	db.set(db.AS_WRITTEN, 'e.f', 5);	// Trigger new nested property

	db.set('a', 1);		// Trigger change on empty storage
	db.set('b', 1);		// Trigger change on non-empty storage
	db.set('a', 2);		// Trigger overwrite of 'a' from 1 to 2
	
	db.set('a.b', 3);	// Trigger recast of 'a' from 2 to {b: 3}
	db.set('a.b.c', 4);	// Trigger nested recast of 'a.b' from 3 to {c: 4}
	
	db.set('a.b', 5);	// Trigger recast of nested {b: c: 4} to 5
	db.set('a', 6);		// Trigger recast of {a: b: 5} to 6

	// Overwrite all written properties to 0
	db.set('a.b', 0);
	db.set('b.c', 0);
	db.set({c: 0, d: 0});
	db.set('e.f', 0);

	db.getChanges();		// Trigger normalization of changes
	db.get();				// Trigger merge of written and changed data
});

suite.on('cycle', function (event) {
	console.log(String(event.target));
});

suite.on('complete', function () {
	const fastest = this.filter('fastest')[0];
	const slowest = this.filter('slowest')[0];

	console.log('');
	console.log('Fastest is ' + this.filter('fastest').map('name'));
	
	if(slowest) {
		const perc = Math.round( (((fastest.hz / slowest.hz) - 1) * 100) * 10 ) / 10;

		console.log(`${fastest.name} is ${perc}% faster than ${slowest.name}`);
	}
});

suite.run({ 'async': true });

return;
return db._inspect({
	written: db.getWritten(),
	changes: db.getChanges(),
	diff: db.diff()
});

data.walk((val, key, parentObject, path) => {
	if (typeof val !== 'function') {
		// console.log('set', path, typeof val);
		db.set(path, val);
	}
});

data.walk((val, key, parentObject, path) => {
	if (typeof val !== 'function') {
		console.log(path, db.get(path) === data.get(path));
	}
});

return;
return db._inspect({
	written: db.getWritten(),
	changes: db.getChanges(),
	diff: db.diff()
});



return;
const employee = dotbox.make('Employee');

employee.set(dotbox.AS_WRITTEN, {
	names: {
		first: 'Anders',
		last: 'Billfors'
	}
});

employee.set(dotbox.AS_WRITTEN, {
	phones: {
		private: 1,
		work: 2,
		office: 3
	}
});

employee.set({
	names: {
		first: 'Jonas',
		last: 'Boman'
	}
});

employee.set(true, {
	phones: {
		private: -1
	}
});

employee.set('names.nickname', 'wiz');

employee._inspect();