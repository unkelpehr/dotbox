'use strict';

const { test } = require('ava');
const {isNested} = require('../');

test('path types', assert => {
    assert.is(isNested(), false, 'dotbox.isNested should return `false` if the path is falsy or not a string.');
    assert.is(isNested(''), false, 'dotbox.isNested should return `false` if the path is falsy or not a string.');
    assert.is(isNested(1), false, 'dotbox.isNested should return `false` if the path is falsy or not a string.');
    assert.is(isNested({}), false, 'dotbox.isNested should return `false` if the path is falsy or not a string.');
});

test('Non-nested paths', assert => {
    assert.is(isNested('foo'), false, `'foo' should not be regarded as nested`);
    assert.is(isNested('foo\\bar'), false, `'foo\\bar' should not be regarded as nested`);
    assert.is(isNested('foo\\.bar'), false, `'foo\\.bar' should not be regarded as nested`);
    assert.is(isNested('foo\\.bar'), false, `'foo\\.bar' should not be regarded as nested`);
    assert.is(isNested('foo\\.bar\\.qux'), false, `'foo\\.bar\\.qux' should not be regarded as nested`);
});

test('Nested paths', assert => {
    assert.is(isNested('foo.bar'), true, `'foo.bar' should be regarded as nested`);
    assert.is(isNested('foo.bar.qux'), true, `'foo.bar.qux' should be regarded as nested`);
    assert.is(isNested('foo\\.bar.qux'), true, `'foo.bar.qux' should be regarded as nested`);
    assert.is(isNested('foo.bar\\.qux'), true, `'foo.bar.qux' should be regarded as nested`);
});