'use strict';

const {test} = require('ava');
const dotbox = require('../');

const makedb = () => dotbox.make('test');

test('Return empty array if no changes has been made.', assert => {
	const db = makedb();

	assert.deepEqual(db.getChangedKeys(), []);
});

test('Unnamed 1', assert => {
	const db = makedb();

	db.set('a', 1);

	assert.deepEqual(db.getChangedKeys(), ['a']);
});


test('Unnamed 2', assert => {
	const db = makedb();

	db.set('a', 1);
	db.set('b', 1);
	db.set('c', 1);

	assert.deepEqual(db.getChangedKeys(), ['a', 'b', 'c']);
});

test('Unnamed 3', assert => {
	const db = makedb();

	db.set({
		a: 1,
		b: 1,
		c: 1
	});

	assert.deepEqual(db.getChangedKeys(), ['a', 'b', 'c']);
});

test('Unnamed 4', assert => {
	const db = makedb();

	db.set({
		a: 1,
		b: 1,
		c: 1
	});

	db.set('a', 1);
	db.set('b', 1);
	db.set('c', 1);

	assert.deepEqual(db.getChangedKeys(), ['a', 'b', 'c']);
});

test('Unnamed 5', assert => {
	const db = makedb();

	db.set('a.b.c.d.e.f', 1);
	db.set('g.h.i.j.k.l', 1);
	db.set('m.n.o.p.q.r', 1);

	assert.deepEqual(db.getChangedKeys(), ['a', 'g', 'm']);
});

test('Unnamed 6', assert => {
	const db = makedb();

	db.set('a.b.c.d.e.f', 1);
	db.set('g.h.i.j.k.l', 1);
	db.set('m.n.o.p.q.r', 1);

	assert.deepEqual(db.getChangedKeys('g'), ['h.i.j.k.l']);
	assert.deepEqual(db.getChangedKeys('g.h'), ['i.j.k.l']);
	assert.deepEqual(db.getChangedKeys('g.h.i'), ['j.k.l']);
	assert.deepEqual(db.getChangedKeys('g.h.i.j'), ['k.l']);
	assert.deepEqual(db.getChangedKeys('g.h.i.j.k'), ['l']);
	assert.deepEqual(db.getChangedKeys('g.h.i.j.k.l'), []);
});

// test('Unnamed 7', assert => {
// 	const db = makedb();

// 	db.set({
// 		a: {
// 			b: 1,
// 			c: {
// 				e: {
// 					f: 1,
// 					g: 3
// 				}
// 			},
// 			d: 3
// 		}
// 	});

// 	assert.deepEqual(db.getChangedKeys('a'), [
// 		'b', 'c', 'd'
// 	]);

// 	assert.deepEqual(db.getChangedKeys('a.b'), [
	
// 	]);

// 	assert.deepEqual(db.getChangedKeys('a.c'), [
// 		'e'
// 	]);

// 	assert.deepEqual(db.getChangedKeys('a.c.e'), [
// 		'f', 'g'
// 	]);

// 	assert.deepEqual(db.getChangedKeys('a.c.e.f'), [
		
// 	]);
// });