'use strict';

const dotbox = require('./dotbox');
const datatypes = require('./datatypes');

const db = dotbox.make('');
const db2 = dotbox.make('');
const data2 = datatypes.get(false);

const isPlainObject = require('./lib/isPlainObject');

const testData = {
	a: 'b',
	c: {
		d: {e: 'cde', f: 'cdf'},
		b: { c: { bla: 'blo'}}
	},
	c: {
		d: {e: 'cde', f: 'cdf'},
		b: { c: { bla: 'blo'}}
	},

	circFoo: {
		circBar: null
	},

	circFoo2: {},
	circFoo3: {},
	array: ['a', 'b', 'c', 'd'],
	circArray: []
};

const extend = require('./lib/extend');
const extend2 = require('./lib/extend.1');

let target;
let source;

target = {
	a: 1,
	b: 1,
	c: 1,
	d: {
		a: 1,
		b: 1,
		c: 1,
		d: {
			a: 'a',
			b: 'b',
			c: 'c',
		},
		e: 1,
		f: 1,
		g: 1,
	},
	e: 1,
	f: 1,
	g: 1,
};

const getTarget = () => ({
	a: 1,
	b: 1,
	c: 1,
	d: {
		a: 1,
		b: 1,
		c: 1,
		d: {
			a: 'a',
			b: 'b',
			c: 'c',
		},
		e: 1,
		f: 1,
		g: 1,
	},
	e: 1,
	f: 1,
	g: 1,
});

source = {
	a: 'a',
	b: 'b',
	c: 'c',
	d: {
		a: 'a',
		b: 'b',
		c: 'c',
		d: {

			1: '1',
			2: '2',
			3: '3',
			d: {
				1: '1',
				2: '2',
				3: '3',
				d: {
					1: '1',
					2: '2',
					3: '3',
				},
				4: '4',
				5: '5',
				6: '6',
			},
			4: '4',
			5: '5',
			6: '6',

		},
		e: 'e',
		f: 'f',
		g: 'g',
	},
	e: 'e',
	f: 'f',
	g: 'g',

	arrays: {
		array1: ['a', 'b', 'c', 'd', 'e', 'f'],
		array2: [{}, {}, {}, {}, {}, {}],
		array3: [
			{
				1: '1',
				2: '2',
				3: '3',
				d: {
					1: '1',
					2: '2',
					3: '3',
				},
				4: '4',
				5: '5',
				6: '6',
			}
		],
		array4: []
	},

	circular: {},
	circArray: []
};

source.arrays.array4.push(source.d);
source.arrays.array4.push(source.d.d);
source.arrays.array4.push(source.d.d.d);

source.circular.foo = {};
source.circular.foo.foo = source.circular.foo = {};

source.circular.c1 = {};
source.circular.c2 = {};
source.circular.c1.c2 = source.circular.c2;
source.circular.c2.c1 = source.circular.c1;

source.c1 = {};
source.c2 = {};

source.c1.c1 = source.c1;
source.c1.c2 = source.c2;

source.c2.c1 = source.c1;
source.c2.c2 = source.c2;

let i = 10;
while (i--) {
	source[`circA${i}`] = {};
	source[`circB${i}`] = {};

	source[`circA${i}`][`circB${i}`] = source[`circA${i}`];
	source[`circB${i}`][`circA${i}`] = source[`circB${i}`];

	source.circArray.push(source[`circA${i}`][`circB${i}`]);
}

// console.log();
// extend2(getTarget(), source)
// process.exit();
const Benchmark = require('benchmark');
const suite = new Benchmark.Suite;

suite.add('extend1', () => {
	extend(getTarget(), source);
});

suite.add('extend2', () => {
	extend2(getTarget(), source);
});

suite.on('cycle', function (event) {
	console.log(String(event.target));
});

suite.on('complete', function () {
	console.log('Fastest is ' + this.filter('fastest').map('name'));
});

suite.run({ 'async': true });

return;
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

//const Benchmark = require('benchmark');
//const suite = new Benchmark.Suite;

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