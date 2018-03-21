'use strict';

const {test} = require('ava');
const dotbox = require('../');

const makedb = () => dotbox.make('test');

test('CHANGE: New property is a child of an existing property that isn\'t an object.', assert => {
	const db = makedb();

	db.set('a', 1);
	db.set('a.b', 2);

	assert.deepEqual(db.getChanges(), {
		'a.b': 2
	});
});


test('CHANGE: New property is a parent of an existing property that isn\'t an object.', assert => {
	const db = makedb();

	db.set('a.b', 2);
	db.set('a', 1);

	assert.deepEqual(db.getChanges(), {
		a: 1
	});
});



test('CHANGE: New property is a nested child of an existing property that isn\'t an object.', assert => {
	const db = makedb();

	db.set('a.b.c', 1);
	db.set('a.b.c.d', 2);

	assert.deepEqual(db.getChanges(), {
		'a.b.c.d': 2
	});
});


test('CHANGE: New property is a nested parent of an existing property that isn\'t an object.', assert => {
	const db = makedb();

	db.set('a.b.c.d', 1);
	db.set('a.b.c', 2);

	assert.deepEqual(db.getChanges(), {
		'a.b.c': 2
	});
});



test('WRITE: New property is a child of an existing property that isn\'t an object.', assert => {
	const db = makedb();

	db.set(dotbox.AS_WRITTEN, 'a', 1);
	db.set(dotbox.AS_WRITTEN, 'a.b', 2);

	assert.deepEqual(db.getWritten(false), {
		a: {b: 2}
	});
});

test('WRITE: New property is a parent of an existing property that isn\'t an object.', assert => {
	const db = makedb();

	db.set(dotbox.AS_WRITTEN, 'a.b', 2);
	db.set(dotbox.AS_WRITTEN, 'a', 1);

	assert.deepEqual(db.getWritten(false), {
		a: 1
	});
});

test('Unnamed 1.', assert => {
	const db = makedb();

	db.set('a.b.c', {
		a: 1,
		b: 2,
		c: 3
	});

	db.set('a.b.c.b.c', 4);

	assert.deepEqual(db.getChanges(), {
		'a.b.c': {
			a: 1,
			b: 2,
			c: 3
		},
		'a.b.c.b.c': 4
	});
});

test('Unnamed 2.', assert => {
	const db = makedb();

	db.set('a', {
		a: 1,
		b: 2,
		c: 3
	});

	db.set('a.b.c', 4);

	assert.deepEqual(db.getChanges(), {
		a: {
			a: 1,
			b: 2,
			c: 3
		},
		'a.b.c': 4
	});
});

test('Unnamed 3.', assert => {
	const db = makedb();

	db.set(db.AS_WRITTEN, 'a.b.c', {
		a: 1,
		b: 2,
		c: 3
	});

	db.set(db.AS_WRITTEN, 'a.b.c.b.c', 4);

	assert.deepEqual(db.getWritten(false), {
		a: {
			b: {
				c: {
					a: 1,
					b: { c: 4 },
					c: 3
				}
			}
		}
	});
});

test('Unnamed 4.', assert => {
	const db = makedb();

	db.set(db.AS_WRITTEN, 'a', {
		a: 1,
		b: 2,
		c: 3
	});

	db.set(db.AS_WRITTEN, 'a.b.c', 4);

	assert.deepEqual(db.getWritten(false), {
		a: {
			a: 1,
			b: { c: 4 },
			c: 3
		}
	});
});