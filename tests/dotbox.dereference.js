'use strict';

const {test} = require('ava');
const {dereference} = require('../');

test('Unnamed 1', assert => {
	
	const object = {};

	const derefed = dereference(object);

	object.foo = 'bar';

	assert.deepEqual(derefed, {});
});



test('Unnamed 2', assert => {

	const object = {
		foo: {
			bar: {

			}
		}
	};

	const derefed = dereference(object);

	object.foo.bar.qux = 'qux';

	assert.deepEqual(derefed, {
		foo: {
			bar: {

			}
		}
	});
});

test('Unnamed 3', assert => {

	const object = {
		a: {
			b: {
				a: new RegExp(),
				b: false,
				c: true,
				d: null,
				e: undefined,
				f: new Array(),
				g: new String(),
				h: {}
			}
		}
	};

	const derefed = dereference(object);

	delete object.a.b;

	assert.deepEqual(derefed, {
		a: {
			b: {
				a: new RegExp(),
				b: false,
				c: true,
				d: null,
			//	e: undefined,
				f: new Array(),
				g: new String(),
				h: {}
			}
		}
	});
});
