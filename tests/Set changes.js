'use strict';

const {test} = require('ava');
const dotbox = require('../');

const WRITTEN_DATA = Object.freeze({
    a: {b: 1.1},
    c: {d: {e: 1.1}},
    f: {g: {h: {i: 1.1}}}
});

const makedb = () => dotbox.make('test').set(dotbox.AS_WRITTEN, WRITTEN_DATA);

/*------------------------------------*\
	ONE CALL.
\*------------------------------------*/
test('Integer. Once. KeyVal.', assert => {
	const db = makedb();

	db.set('a', 1.1);

	assert.deepEqual(db.getChanges(), {a: 1.1});
	assert.deepEqual(db.getWritten(false), WRITTEN_DATA, 'Setting changes should not effect the written data.');
});

test('Flat object. Once.', assert => {
	const props = {
		a: 1.1,
		b: 2.1,
		c: 3.1
	};

	const db = makedb();

	db.set(props);

	assert.deepEqual(db.getChanges(), props);
	assert.deepEqual(db.getWritten(false), WRITTEN_DATA, 'Setting changes should not effect the written data.');
});

test('Nested object. Once.', assert => {
	const props = {
		a: {b: 1.1},
		c: {d: {e: 1.1}},
		f: {g: {h: {i: 1.1}}}
	};

	const db = makedb();

	db.set(props);

	assert.deepEqual(db.getChanges(), props);
	assert.deepEqual(db.getWritten(false), WRITTEN_DATA, 'Setting changes should not effect the written data.');
});

test('Dot notation. Once. KeyVal.', assert => {
	const db = makedb();

	db.set('f.g.h.i', 1.1);

	assert.deepEqual(db.getChanges(), {
		'f.g.h.i': 1.1
	});
});

test('Dot notation. Once. Object.', assert => {
	const db = makedb();

	db.set({
		'a.b': 1.1,
		'c.d.e': 2.1,
		'f.g.h.i': 3.1
	});

	assert.deepEqual(db.getChanges(), {
		'a.b': 1.1,
		'c.d.e': 2.1,
		'f.g.h.i': 3.1
	});

	assert.deepEqual(db.getWritten(false), WRITTEN_DATA, 'Setting changes should not effect the written data.');
});

/*------------------------------------*\
	MULTIPLE CALLS.
\*------------------------------------*/
test('Integer. Multi. KeyVal.', assert => {
	const db = makedb();

	db.set('a', 1.1);
	db.set('a', 1.2);

	assert.deepEqual(db.getChanges(), {a: 1.2});
	assert.deepEqual(db.getWritten(false), WRITTEN_DATA, 'Setting changes should not effect the written data.');
});

test('Flat object. Multi.', assert => {
	const props1 = { a: 1.1, b: 2.1, c: 3.1 };
	const props2 = { a: 1.2, b: 2.2, c: 3.2 };

	const db = makedb();

	db.set(props1);
	db.set(props2);

	assert.deepEqual(db.getChanges(), props2);
	assert.deepEqual(db.getWritten(false), WRITTEN_DATA, 'Setting changes should not effect the written data.');
});

test('Nested object. Multi.', assert => {
	const props1 = {
		a: {b: 1.1},
		c: {d: {e: 2.1}},
		f: {g: {h: {i: 3.1}}}
	};

	const props2 = {
		a: {b: 1.2},
		c: {d: {e: 2.2}},
		f: {g: {h: {i: 3.2}}}
	};

	const db = makedb();

	db.set(props1);
	db.set(props2);

	assert.deepEqual(db.getChanges(), props2);
	assert.deepEqual(db.getWritten(false), WRITTEN_DATA, 'Setting changes should not effect the written data.');
});

test('Dot notation. Multi. KeyVal.', assert => {
	const db = makedb();

	db.set('f.g.h.i', 1.1);
	db.set('f.g.h.i', 1.2);

	assert.deepEqual(db.getChanges(), {'f.g.h.i': 1.2});
	assert.deepEqual(db.getWritten(false), WRITTEN_DATA, 'Setting changes should not effect the written data.');
});

test('Dot notation. Multi. Object.', assert => {
	const db = makedb();

	const props1 = {
		'a.b': 1.1,
		'c.d.e': 2.1,
		'f.g.h.i': 3.1
	};

	const props2 = {
		'a.b': 1.2,
		'c.d.e': 2.2,
		'f.g.h.i': 3.2
	};

	db.set(props1);
	db.set(props2);

	assert.deepEqual(db.getChanges(), {
		'a.b': 1.2,
		'c.d.e': 2.2,
		'f.g.h.i': 3.2
	});

	assert.deepEqual(db.getWritten(false), WRITTEN_DATA, 'Setting changes should not effect the written data.');
});