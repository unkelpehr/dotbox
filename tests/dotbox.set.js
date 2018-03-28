'use strict';

const {test} = require('ava');
const {flags, set} = require('../');

test('No merge, root level', assert => {
	const object = {};

	set(object, 'a', 'b');
	set(0, object, 'b', 'c');

	assert.deepEqual(object, {
		a: 'b',
		b: 'c'
	});

	set(object, 'a', 'not b');
	set(0, object, 'b', 'not c');

	assert.deepEqual(object, {
		a: 'not b',
		b: 'not c'
	});

	set(0, object, 'c', undefined);
	set(0, object, 'd', null);
	set(0, object, 'e', 0);
	set(0, object, 'f', {});

	assert.deepEqual(object, {
		a: 'not b',
		b: 'not c',
		c: undefined,
		d: null,
		e: 0,
		f: {}
	});
});

test('No merge, nested', assert => {
	const object = {};

	set(object,			'a.a', 'b');
	set(0, object,		'b.b', 'c');

	assert.deepEqual(object, {
		a: {a: 'b'},
		b: {b: 'c'}
	});

	set(object,			'a.a', 'not b');
	set(0, object,		'b.b', 'not c');

	assert.deepEqual(object, {
		a: {a: 'not b'},
		b: {b: 'not c'}
	});

	set(0, object,		'c.c', undefined);
	set(0, object,		'd.d', null);
	set(0, object,		'e.e', 0);
	set(0, object,		'f.f', {});

	assert.deepEqual(object, {
		a: {a: 'not b'},
		b: {b: 'not c'},
		c: {c: undefined},
		d: {d: null},
		e: {e: 0},
		f: {f: {}},
	});
});


test('Shallow merge', assert => {
	const object = {
		a: {
			a: 1,
			b: 2,
			c: 3
		},
		b: {
			a: 1,
			b: 2,
			c: 3
		},
		c: {
			a: 1,
			b: 2,
			c: 3
		}
	};

	set(flags.SMERGE, object, 'b', {
		c: 0,
		d: 4,
		e: 5
	});

	assert.deepEqual(object, {
		a: {
			a: 1,
			b: 2,
			c: 3
		},
		b: {
			a: 1,
			b: 2,
			c: 0,
			d: 4,
			e: 5
		},
		c: {
			a: 1,
			b: 2,
			c: 3
		}
	});

	set(flags.SMERGE, object, 'b.f', 6);

	assert.deepEqual(object, {
		a: {
			a: 1,
			b: 2,
			c: 3
		},
		b: {
			a: 1,
			b: 2,
			c: 0,
			d: 4,
			e: 5,
			f: 6
		},
		c: {
			a: 1,
			b: 2,
			c: 3
		}
	});
});

test('Deep merge, one level', assert => {
	const object = {
		a: {
			a: 1,
			b: 2,
			c: 3
		},
		b: {
			a: 1,
			b: 2,
			c: 3
		},
		c: {
			a: 1,
			b: 2,
			c: 3
		}
	};

	set(flags.DMERGE, object, 'b', {
		c: 0,
		d: 4,
		e: 5
	});

	assert.deepEqual(object, {
		a: {
			a: 1,
			b: 2,
			c: 3
		},
		b: {
			a: 1,
			b: 2,
			c: 0,
			d: 4,
			e: 5
		},
		c: {
			a: 1,
			b: 2,
			c: 3
		}
	});

	set(flags.DMERGE, object, 'b.f', 6);

	assert.deepEqual(object, {
		a: {
			a: 1,
			b: 2,
			c: 3
		},
		b: {
			a: 1,
			b: 2,
			c: 0,
			d: 4,
			e: 5,
			f: 6
		},
		c: {
			a: 1,
			b: 2,
			c: 3
		}
	});

	set(flags.DMERGE, object, 'a', {
		a: 0,
		b: 0,
		c: 0,
		d: 1
	});

	set(flags.DMERGE, object, 'b', {
		a: 0,
		b: 0,
		c: 0,
		d: 0,
		e: 0,
		f: 0,
		g: 1
	});

	set(flags.DMERGE, object, 'c', {
		a: 0,
		b: 0,
		c: 0,
		d: 1
	});

	assert.deepEqual(object, {
		a: {
			a: 0,
			b: 0,
			c: 0,
			d: 1
		},
		b: {
			a: 0,
			b: 0,
			c: 0,
			d: 0,
			e: 0,
			f: 0,
			g: 1
		},
		c: {
			a: 0,
			b: 0,
			c: 0,
			d: 1
		}
	});
});


test('Deep merge, multi-level', assert => {
	const object = {
		a: {
			b: {
				c: 1,
				d: 2,
			},
			c: {
				d: {
					e: {
						f: 1,
						g: 2,
						h: 3
					}
				}
			}
		}
	};

	set(flags.DMERGE, object, 'a', {
		b: {
			c: 0,
			d: 0,
		},
		c: {
			d: {
				e: {
					f: 0,
					g: 0,
					h: 0
				}
			}
		}
	});

	assert.deepEqual(object, {
		a: {
			b: {
				c: 0,
				d: 0,
			},
			c: {
				d: {
					e: {
						f: 0,
						g: 0,
						h: 0
					}
				}
			}
		}
	});

	set(flags.DMERGE, object, 'a', {
		c: { d: { e: { f: 1 } } }
	});

	assert.deepEqual(object, {
		a: {
			b: {
				c: 0,
				d: 0,
			},
			c: {
				d: {
					e: {
						f: 1,
						g: 0,
						h: 0
					}
				}
			}
		}
	});

	set(flags.DMERGE, object, 'a', {
		c: { d: { e: {
			f: 0,
			i: 1
		} } }
	});

	assert.deepEqual(object, {
		a: {
			b: {
				c: 0,
				d: 0,
			},
			c: {
				d: {
					e: {
						f: 0,
						g: 0,
						h: 0,
						i: 1
					}
				}
			}
		}
	});
});