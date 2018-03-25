'use strict';

const {test} = require('ava');
const {isPlainObject} = require('../');

test('These are NOT regarded as plain objects', assert => {
	class Foo {}
	assert.is(isPlainObject(	Math				), false);
	assert.is(isPlainObject(	Math.abs			), false);
	assert.is(isPlainObject(	Foo					), false);
	assert.is(isPlainObject(	new Foo				), false);
	assert.is(isPlainObject(	[1, 2, 3]			), false);
	assert.is(isPlainObject(	Object				), false);
	assert.is(isPlainObject(	null				), false);
	assert.is(isPlainObject(	'str'				), false);
	assert.is(isPlainObject(	5					), false);
	assert.is(isPlainObject(	true				), false);
	assert.is(isPlainObject(	undefined			), false);
	assert.is(isPlainObject(	new Date()			), false);
	assert.is(isPlainObject(	/foo/				), false);
	assert.is(isPlainObject(	[]					), false);
	assert.is(isPlainObject(	function () { }		), false);
	assert.is(isPlainObject(	new Array()			), false);
	assert.is(isPlainObject(	new String()		), false);
	assert.is(isPlainObject(	new Boolean()		), false);
});

test('These are regarded as plain objects', assert => {
	assert.is(isPlainObject(	{}						), true);
	assert.is(isPlainObject(	{ 'x': 0, 'y': 0 }		), true);
	assert.is(isPlainObject(	Object.create(null)		), true);
	assert.is(isPlainObject(	Object.create({})		), true);
	assert.is(isPlainObject(	new Object()			), true);
	assert.is(isPlainObject(	Object.prototype		), true);
});
