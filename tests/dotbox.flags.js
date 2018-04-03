'use strict';

const {test} = require('ava');
const {flags} = require('../');

const _flags = {
	KEEPR: 2,
	WRITE: 4,
	DMERGE: 8,
	SMERGE: 16,
	DELETE: 32,
};

test('extend', assert => {
	const object = {};

	flags.extend(object);

	assert.deepEqual(object, _flags);
});

test('parse', assert => {
	assert.deepEqual(flags.parse(0), {
		KEEPR: false,
		WRITE: false,
		DMERGE: false,
		SMERGE: false,
		DELETE: false,
	});

	assert.deepEqual(flags.parse(flags.KEEPR), {
		KEEPR: true,
		WRITE: false,
		DMERGE: false,
		SMERGE: false,
		DELETE: false,
	});

	assert.deepEqual(flags.parse(flags.KEEPR | flags.WRITE), {
		KEEPR: true,
		WRITE: true,
		DMERGE: false,
		SMERGE: false,
		DELETE: false,
	});

	assert.deepEqual(flags.parse(flags.KEEPR | flags.WRITE | flags.DMERGE), {
		KEEPR: true,
		WRITE: true,
		DMERGE: true,
		SMERGE: false,
		DELETE: false,
	});

	assert.deepEqual(flags.parse(flags.KEEPR | flags.WRITE | flags.DMERGE | flags.SMERGE), {
		KEEPR: true,
		WRITE: true,
		DMERGE: true,
		SMERGE: true,
		DELETE: false,
	});

	assert.deepEqual(flags.parse(flags.KEEPR | flags.WRITE | flags.DMERGE | flags.SMERGE | flags.DELETE), {
		KEEPR: true,
		WRITE: true,
		DMERGE: true,
		SMERGE: true,
		DELETE: true,
	});
});
