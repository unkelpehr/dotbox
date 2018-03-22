'use strict';

const {test} = require('ava');
const dotbox = require('../');

const makedb = () => dotbox.make('test');

test('Get everything.', assert => {
	const db = makedb();

	db.set('a.b.c', 1);
	db.set(db.WRITE, 'd.e.f', 2);

	assert.deepEqual(db.get(), {
		a: {b: {c: 1}},
		d: {e: {f: 2}}
	});
});

test('Get everything, but no changes.', assert => {
	const db = makedb();

	db.set('a.b.c', 1);
	db.set(db.WRITE, 'd.e.f', 2);

	assert.deepEqual(db.get(false), {
		// a: {b: {c: 1}},
		d: {e: {f: 2}}
	});
});

test('Get top level value, including and exluding changes.', assert => {
	const db = makedb();

	db.set(db.WRITE, {
		'a.b': 1.1,
		'c.d': 2.1,
		'e.f': 3.1
	});

	db.set('c.d', 2.2);

	assert.deepEqual(db.get(true,  'a'), {b: 1.1});
	assert.deepEqual(db.get(true,  'c'), {d: 2.2});
	assert.deepEqual(db.get(false, 'c'), {d: 2.1});
	assert.deepEqual(db.get(true,  'e'), {f: 3.1});
});

test('Get nested value, including and exluding changes.', assert => {
	const db = makedb();

	db.set(db.WRITE, {
		'a.b': 1.1,
		'c.d': 2.1,
		'e.f': 3.1
	});

	db.set('c.d', 2.2);

	assert.deepEqual(db.get(true,  'a.b'), 1.1);
	assert.deepEqual(db.get(true,  'c.d'), 2.2);
	assert.deepEqual(db.get(false, 'c.d'), 2.1);
	assert.deepEqual(db.get(true,  'e.f'), 3.1);
});