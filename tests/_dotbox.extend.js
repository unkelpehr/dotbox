'use strict';

const {test} = require('ava');
const {extend} = require('../');

test('Unnamed', assert => {
	const object = {};

	assert.deepEqual(object, {});
});
