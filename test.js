'use strict';

const dotbox = require('./dotbox');
const datatypes = require('./datatypes');

const db = dotbox.make('');
const db2 = dotbox.make('');
const data2 = datatypes.get(false);

/* db.set('a', {
	a: 1,
	b: 2,
	c: 3
});

db.set('a.b.c', 4);

return db._inspect({
	written: db.getWritten(),
	changes: db.getChanges(),
	diff: db.diff()
}); */

const Benchmark = require('benchmark');
const suite = new Benchmark.Suite;

suite.add('db.set-original', () => {
	const db = dotbox.make('');

	db.set2('a', 1);
	db.set2('a', 2);
	
	db.set2('a.b', 3);
	db.set2('a.b.c', 4);
	
	db.set2('a.b', 1);
	db.set2('a', {});
});

suite.add('db.set-new', () => {
	const db = dotbox.make('');

	db.set('a', 1);
	db.set('a', 2);

	db.set('a.b', 3);
	db.set('a.b.c', 4);

	db.set('a.b', 1);
	db.set('a', {});
});

suite.on('cycle', function (event) {
	console.log(String(event.target));
});

suite.on('complete', function () {
	console.log('Fastest is ' + this.filter('fastest').map('name'));
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