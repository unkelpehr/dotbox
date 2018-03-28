'use strict';

const {test} = require('ava');
const {get} = require('../');

test('Nothing escaped', assert => {
	assert.deepEqual(get({}, ''), undefined);
	assert.deepEqual(get({ a: 'b' }, 'a'), 'b');
	assert.deepEqual(get({ a: { b: { c: 1 } } }, 'a'), { b: { c: 1 } });
	assert.deepEqual(get({ a: { b: { c: 1 } } }, 'a.b'), { c: 1 });
	assert.deepEqual(get({ a: { b: { c: 1 } } }, 'a.b.c'), 1);
	assert.deepEqual(get({ a: { b: { c: 0 } } }, 'a.b.c'), 0);
	assert.deepEqual(get({ a: { b: { c: undefined } } }, 'a.b.c'), undefined);

	assert.deepEqual(get({ a: { b: { c: { d: false, e: 'tivoli' } } } }, 'a.b.c'), {
		d: false,
		e: 'tivoli'
	});
});

test('Escaped paths', assert => {
	assert.deepEqual(get({ a: { b: { c: 1 } } }, 'a\\.b.c'), undefined);
	assert.deepEqual(get({ a: { b: { c: 1 } } }, '\\.a.b.c'), undefined);
	assert.deepEqual(get({ a: { b: { c: 1 } } }, 'a.b.c\\.'), undefined);

	assert.deepEqual(get({ 'a\\.b': { c: 1 } }, 'a\\.b.c'), 1);
	assert.deepEqual(get({ '\\.a': { b: { c: 1 } } }, '\\.a.b.c'), 1);
	assert.deepEqual(get({ a: { b: { 'c\\.': 1 } } }, 'a.b.c\\.'), 1);
	assert.deepEqual(get({ 'a\\.b\\.c': { d: 1 } }, 'a\\.b\\.c'), { d: 1 });
});

test('Not to be confused with escaped paths', assert => {
	assert.deepEqual(get({ a: { '\\b': { c: 1 } } }, 'a.\\b.c'), 1);
	assert.deepEqual(get({ '\\a': { b: { c: 1 } } }, '\\a.b.c'), 1);
	assert.deepEqual(get({ a: { b: { 'c\\': 1 } } }, 'a.b.c\\'), 1);

	assert.deepEqual(get({
		'\\a': {
			'\\b': {
				'\\c\\': {
					d: 1
				}
			}
		}
	}, '\\a.\\b.\\c\\'), { d: 1 });
});

test('Should work with own non-enumerable properties', assert => {
	const object = {
		aaa: {}
	};

	Object.defineProperty(object.aaa, 'bbb', {
		enumerable: false,
		value: {
			ccc: 'abc'
		}
	});

	assert.deepEqual(get(object, 'aaa.bbb.ccc'), 'abc');
});

test('Should work with inherited properties, as default.', assert => {
	const object = Object.create({
		proto1: 'prototype property',
		proto2: {
			foo: 'bar'
		}
	}, {
		ownProperty: {
			value: 'non-enumerable own property'
		}
	});

	assert.deepEqual(get(object, 'ownProperty'), 'non-enumerable own property');

	assert.deepEqual(get(object, 'proto1'), 'prototype property');
	assert.deepEqual(get(object, 'proto2'), { foo: 'bar' });
	assert.deepEqual(get(object, 'proto2.foo'), 'bar');

	assert.deepEqual(get(true, object, 'proto1'), undefined);
	assert.deepEqual(get(true, object, 'proto2'), undefined);
	assert.deepEqual(get(true, object, 'proto2.foo'), undefined);
});
