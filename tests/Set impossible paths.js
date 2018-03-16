'use strict';

const {test} = require('ava');
const dotbox = require('../');

const makedb = () => dotbox.make('test');

test('Impossible path, change.', assert => {
	const db = makedb();

	db.set('a', 1);
	db.set('a.b', 2);

	assert.deepEqual(db.getChanges(false), {
		a: {b: 2}
	});
});

test('Impossible path, written.', assert => {
	const db = makedb();

	db.set(dotbox.AS_WRITTEN, 'a', 1);
	db.set(dotbox.AS_WRITTEN, 'a.b', 2);

	assert.deepEqual(db.getWritten(false), {
		a: {b: 2}
	});
});
