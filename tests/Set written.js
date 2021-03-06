'use strict';

const {test} = require('ava');
const dotbox = require('../');

const CHANGES_DATA = Object.freeze({
    a: {b: 1.1},
    c: {d: {e: 1.1}},
    f: {g: {h: {i: 1.1}}}
});

const makedb = () => dotbox.createDocument('test').set(CHANGES_DATA);

/*------------------------------------*\
	ONE CALL.
\*------------------------------------*/
test('Integer. Once. KeyVal.', assert => {
	const db = makedb();

	db.set(db.WRITE, 'a', 1.1);

	assert.deepEqual(db.get(false), {a: 1.1});
	assert.deepEqual(db.changes, CHANGES_DATA, 'Setting changes should not effect the changes.');
});

test('Flat object. Once.', assert => {
	const props = {
		a: 1.1,
		b: 2.1,
		c: 3.1
	};

	const db = makedb();

	db.set(db.WRITE, props);

	assert.deepEqual(db.get(false), props);
	assert.deepEqual(db.changes, CHANGES_DATA, 'Setting changes should not effect the changes.');
});

test('Nested object. Once.', assert => {
	const props = {
		a: {b: 1.1},
		c: {d: {e: 1.1}},
		f: {g: {h: {i: 1.1}}}
	};

	const db = makedb();

	db.set(db.WRITE, props);

	assert.deepEqual(db.get(false), props);
	assert.deepEqual(db.changes, CHANGES_DATA, 'Setting changes should not effect the changes.');
});

test('Dot notation. Once. KeyVal.', assert => {
	const db = makedb();

	db.set(db.WRITE, 'f.g.h.i', 1.1);

	assert.deepEqual(db.get(false), {
		f: {g: {h: {i: 1.1}}}
	});
});

test('Dot notation. Once. Object.', assert => {
	const db = makedb();

	db.set(db.WRITE, {
		'a.b': 1.1,
		'c.d.e': 2.1,
		'f.g.h.i': 3.1
	});

	assert.deepEqual(db.get(false), {
		a: {b: 1.1},
		c: {d: {e: 2.1}},
		f: {g: {h: {i: 3.1}}}
	});

	assert.deepEqual(db.changes, CHANGES_DATA, 'Setting changes should not effect the changes.');
});

/*------------------------------------*\
	MULTIPLE CALLS.
\*------------------------------------*/
test('Integer. Multi. KeyVal.', assert => {
	const db = makedb();

	db.set(db.WRITE, 'a', 1.1);
	db.set(db.WRITE, 'a', 1.2);

	assert.deepEqual(db.get(false), {a: 1.2});
	assert.deepEqual(db.changes, CHANGES_DATA, 'Setting changes should not effect the changes.');
});

test('Flat object. Multi.', assert => {
	const props1 = { a: 1.1, b: 2.1, c: 3.1 };
	const props2 = { a: 1.2, b: 2.2, c: 3.2 };

	const db = makedb();

	db.set(db.WRITE, props1);
	db.set(db.WRITE, props2);

	assert.deepEqual(db.get(false), props2);
	assert.deepEqual(db.changes, CHANGES_DATA, 'Setting changes should not effect the changes.');
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

	db.set(db.WRITE, props1);
	db.set(db.WRITE, props2);

	assert.deepEqual(db.get(false), props2);
	assert.deepEqual(db.changes, CHANGES_DATA, 'Setting changes should not effect the changes.');
});

test('Dot notation. Multi. KeyVal.', assert => {
	const db = makedb();

	db.set(db.WRITE, 'f.g.h.i', 1.1);
	db.set(db.WRITE, 'f.g.h.i', 1.2);

	assert.deepEqual(db.get(false), {f: {g: {h: {i: 1.2}}}});
	assert.deepEqual(db.changes, CHANGES_DATA, 'Setting changes should not effect the changes.');
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

	db.set(db.WRITE, props1);
	db.set(db.WRITE, props2);

	assert.deepEqual(db.get(false), {
		a: {b: 1.2},
		c: {d: {e: 2.2}},
		f: {g: {h: {i: 3.2}}}
	});

	assert.deepEqual(db.changes, CHANGES_DATA, 'Setting changes should not effect the changes.');
});