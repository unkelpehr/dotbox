'use strict';

const {test} = require('ava');
const {normalize} = require('../');

test('Unnamed', assert => {
	const object = {};

	assert.deepEqual(object, {});
});
