'use strict';

const {test} = require('ava');
const {normalize} = require('../');

test('root level: no conflicts', assert => {
	assert.deepEqual(normalize({
		'a': 1,
		'b': 2,
	}), {
		'a': 1,
		'b': 2,
	});
});

test('root level: key override', assert => {
	assert.deepEqual(normalize({
		'a': 1,
		'b': 2,
	}, {
		'b': 0,
	}), {
		'a': 1,
		'b': 2,
	});
});

test('root level: new key is a child of a non-plain source parent', assert => {
	assert.deepEqual(normalize({
		'a': 1,
		'a.b': 1,
	}), {
		'a.b': 1,
	});
});

test('root level: new key is a non-plain parent of a previous source child', assert => {
	assert.deepEqual(normalize({
		'a.b': 1,
		'a': 1,
	}), {
		'a': 1,
	});
});

test('root level: new key is a child of a plain source parent', assert => {
	assert.deepEqual(normalize({
		'a': {},
		'a.b': 1,
	}), {
		'a': {},
		'a.b': 1,
	});
});

test('root level: new key is a plain parent of a previous source child', assert => {
	assert.deepEqual(normalize({
		'a.b': 1,
		'a': {},
	}), {
		'a': {},
	});
});

///// With target

test('root level: new key is a child of a non-plain target parent', assert => {
	assert.deepEqual(normalize({
		'a': 1,
	}, {
		'a.b': 1,
	}), {
		'a': 1,
	});
});

test('root level: new key is a non-plain parent of a previous target child', assert => {
	assert.deepEqual(normalize({
		'a.b': 1,
	}, {
		'a': 1,
	}), {
		'a.b': 1,
	});
});

test('root level: new key is a child of a plain target parent', assert => {
	assert.deepEqual(normalize({
		'a': {},
	}, {
		'a.b': 1,
	}), {
		'a': {},
	});
});

test('root level: new key is a plain parent of a previous target child', assert => {
	assert.deepEqual(normalize({
		'a.b': 1,
	}, {
		'a': {},
	}), {
		'a': {},
		'a.b': 1,
	});
});

// Same thing again, but with multiple levels

test('root level: no conflicts', assert => {
	assert.deepEqual(normalize({
		'a.b.c.d.e': 1,
		'b.c.d.e.f': 2,
	}), {
		'a.b.c.d.e': 1,
		'b.c.d.e.f': 2,
	});
});

test('root level: key override', assert => {
	assert.deepEqual(normalize({
		'a.b.c.d.e': 1,
		'b.c.d.e.f': 2,
	}, {
		'b.c.d.e.f': 0,
	}), {
		'a.b.c.d.e': 1,
		'b.c.d.e.f': 2,
	});
});

test('root level: new key is a child of a non-plain source parent', assert => {
	assert.deepEqual(normalize({
		'a.b.c.d.e': 1,
		'a.b.c.d.e.f': 1,
	}), {
		'a.b.c.d.e.f': 1,
	});
});

test('root level: new key is a non-plain parent of a previous source child', assert => {
	assert.deepEqual(normalize({
		'a.b.c.d.e.f': 1,
		'a.b.c.d.e': 1,
	}), {
		'a.b.c.d.e': 1,
	});
});

test('root level: new key is a child of a plain source parent', assert => {
	assert.deepEqual(normalize({
		'a.b.c.d.e': {},
		'a.b.c.d.e.f': 1,
	}), {
		'a.b.c.d.e': {},
		'a.b.c.d.e.f': 1,
	});
});

test('root level: new key is a plain parent of a previous source child', assert => {
	assert.deepEqual(normalize({
		'a.b.c.d.e.f': 1,
		'a.b.c.d.e': {},
	}), {
		'a.b.c.d.e': {},
	});
});

///// With target

test('root level: new key is a child of a non-plain target parent', assert => {
	assert.deepEqual(normalize({
		'a.b.c.d.e': 1,
	}, {
		'a.b.c.d.e.f': 1,
	}), {
		'a.b.c.d.e': 1,
	});
});

test('root level: new key is a non-plain parent of a previous target child', assert => {
	assert.deepEqual(normalize({
		'a.b.c.d.e.f': 1,
	}, {
		'a.b.c.d.e': 1,
	}), {
		'a.b.c.d.e.f': 1,
	});
});

test('root level: new key is a child of a plain target parent', assert => {
	assert.deepEqual(normalize({
		'a.b.c.d.e': {},
	}, {
		'a.b.c.d.e.f': 1,
	}), {
		'a.b.c.d.e': {},
	});
});

test('root level: new key is a plain parent of a previous target child', assert => {
	assert.deepEqual(normalize({
		'a.b.c.d.e.f': 1,
	}, {
		'a.b.c.d.e': {},
	}), {
		'a.b.c.d.e': {},
		'a.b.c.d.e.f': 1,
	});
});