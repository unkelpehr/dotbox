'use strict';

const {test} = require('ava');
const {getSegments} = require('../');

test('Nothing escaped', assert => {
	assert.deepEqual(getSegments('a.b.c.d.e'), [
		'a',
		'b',
		'c',
		'd',
		'e'
	]);

	assert.deepEqual(getSegments('aaa.bbb.ccc.ddd.eee'), [
		'aaa',
		'bbb',
		'ccc',
		'ddd',
		'eee'
	]);

	assert.deepEqual(getSegments(''), []);
	assert.deepEqual(getSegments('a'), ['a']);
	assert.deepEqual(getSegments('aaa'), ['aaa']);
});

test('Path beginning with escaped dot', assert => {
	assert.deepEqual(getSegments('\\.aaa.bbb.ccc'), [
		'\\.aaa',
		'bbb',
		'ccc',
	]);

	assert.deepEqual(getSegments('\\.\\.aaa.bbb.ccc'), [
		'\\.\\.aaa',
		'bbb',
		'ccc',
	]);
});

test('Path ending with escaped dot', assert => {
	assert.deepEqual(getSegments('aaa.bbb.ccc\\.'), [
		'aaa',
		'bbb',
		'ccc\\.',
	]);

	assert.deepEqual(getSegments('aaa.bbb.ccc\\.\\.'), [
		'aaa',
		'bbb',
		'ccc\\.\\.',
	]);
});

test('With escape segments escaped', assert => {
	assert.deepEqual(getSegments('a\\.b.c.d.e'), [
		'a\\.b',
		'c',
		'd',
		'e'
	]);

	assert.deepEqual(getSegments('aaa\\.bbb.ccc.ddd.eee'), [
		'aaa\\.bbb',
		'ccc',
		'ddd',
		'eee'
	]);

	assert.deepEqual(getSegments('a.b.c.d\\.e'), [
		'a',
		'b',
		'c',
		'd\\.e'
	]);

	assert.deepEqual(getSegments('aaa.bbb.ccc.ddd\\.eee'), [
		'aaa',
		'bbb',
		'ccc',
		'ddd\\.eee'
	]);

	assert.deepEqual(getSegments('a.b\\.c.d.e'), [
		'a',
		'b\\.c',
		'd',
		'e'
	]);

	assert.deepEqual(getSegments('aaa.bbb\\.ccc.ddd.eee'), [
		'aaa',
		'bbb\\.ccc',
		'ddd',
		'eee'
	]);

	assert.deepEqual(getSegments('a\\.b.c\\.d.e'), [
		'a\\.b',
		'c\\.d',
		'e'
	]);

	assert.deepEqual(getSegments('aaa\\.bbb.ccc\\.ddd.eee'), [
		'aaa\\.bbb',
		'ccc\\.ddd',
		'eee'
	]);

	assert.deepEqual(getSegments('a\\.b\\.c\\.d\\.e'), [
		'a\\.b\\.c\\.d\\.e'
	]);

	assert.deepEqual(getSegments('aaa\\.bbb\\.ccc\\.ddd\\.eee'), [
		'aaa\\.bbb\\.ccc\\.ddd\\.eee'
	]);
});

test('Not actually escaped', assert => {
	assert.deepEqual(getSegments('\\aaa.bbb.ccc.ddd.eee'), [
		'\\aaa', 'bbb', 'ccc', 'ddd', 'eee'
	]);

	assert.deepEqual(getSegments('\\aaa.\\bbb.ccc.ddd.eee'), [
		'\\aaa', '\\bbb', 'ccc', 'ddd', 'eee'
	]);

	assert.deepEqual(getSegments('aaa.bbb.ccc.ddd.eee\\'), [
		'aaa', 'bbb', 'ccc', 'ddd', 'eee\\'
	]);

	assert.deepEqual(getSegments('\\aaa.\\bbb.\\ccc.\\ddd.\\eee\\'), [
		'\\aaa', '\\bbb', '\\ccc', '\\ddd', '\\eee\\'
	]);
});