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

const db = dotbox.createDocument();

db.set('a', 1);
db.set('b', 2);
db.set('c.d', 3);

dotbox._inspect({
	changelog: db.changelog
})

return;

suite.add('dir1', () => {
	dir1('aaa.bbb.ccc.ddd.eee', -1);
});

suite.add('dir2', () => {
	dir2('aaa.bbb.ccc.ddd.eee', -1);
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