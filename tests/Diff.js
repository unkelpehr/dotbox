'use strict';

const {test} = require('ava');
const dotbox = require('../');

const makedb = () => dotbox.make('test');

test('Nothing written. One level literals.', assert => {
	const db = makedb();

	db.set('a', 1);

	assert.deepEqual(db.diff(), {
		a: {
			old: undefined,
			new: 1
		}
	});
	
	db.set('a', 2);
	db.set('b', null);

	assert.deepEqual(db.diff(), {
		a: {
			old: undefined,
			new: 2
		},
		b: {
			old: undefined,
			new: null
		}
	});

	db.set('b', 0);
	db.set('c', true);
	db.set('d', false);

	assert.deepEqual(db.diff(), {
		a: {
			old: undefined,
			new: 2
		},
		b: {
			old: undefined,
			new: 0
		},
		c: {
			old: undefined,
			new: true
		},
		d: {
			old: undefined,
			new: false
		}
	});
});

test('Nothing written. Nested.', assert => {
	const db = makedb();

	db.set('a.b.c', 1);
	db.set('b', 2);

	assert.deepEqual(db.diff(), {
		a: {
			old: undefined,
			new: {b: {c: 1}}
		},
		b: {
			old: undefined,
			new: 2
		}
	});

	db.set('a.b.c', 2);
	db.set('b.c.d', 3);

	assert.deepEqual(db.diff(), {
		a: {
			old: undefined,
			new: {b: {c: 2}}
		},
		b: {
			old: undefined,
			new: {c: {d: 3}}
		}
	});
});

test('Diff: {a: {}}', assert => {
	const db = makedb();

	db.set('a', {});
	db.set('b', {});

	assert.deepEqual(db.diff(), {
		a: {
			old: undefined,
			new: {}
		},
		b: {
			old: undefined,
			new: {}
		},
	});
	
	db.set('a', {b:1});
	db.set('b', {c:1});

	assert.deepEqual(db.diff(), {
		a: {
			old: undefined,
			new: {b:1}
		},
		b: {
			old: undefined,
			new: {c:1}
		}
	});
});

test('Diff: {a.b.c: {}}', assert => {
	const db = makedb();

	db.set('a.b.c', {});
	db.set('d.e.f', {});

	assert.deepEqual(db.diff(), {
		a: {
			old: undefined,
			new: {b: {c: {}}}
		},
		d: {
			old: undefined,
			new: {e: {f: {}}}
		}
	});

	db.set('a.b.c', {d:1});
	db.set('d.e.f', {g:2});

	assert.deepEqual(db.diff(), {
		a: {
			old: undefined,
			new: {b: {c: {d:1}}}
		},
		d: {
			old: undefined,
			new: {e: {f: {g:2}}}
		}
	});
});

test('Dot notation should not overwrite siblings even if `deepMerge` is set to false (one level)', assert => {
	const db = makedb();

	db.set('a.b', 1);

	assert.deepEqual(db.diff(), {
		a: {
			old: undefined,
			new: { b: 1 }
		}
	});

	db.set('a.c', 2);

	assert.deepEqual(db.diff(), {
		a: {
			old: undefined,
			new: {
				b: 1,
				c: 2
			}
		}
	});
});

test('Dot notation should not overwrite siblings even if `deepMerge` is set to false (2 levels)', assert => {
	const db = makedb();

	db.set('a.b.c', 1);

	assert.deepEqual(db.diff(), {
		a: {
			old: undefined,
			new: { b: {c: 1} }
		}
	});

	db.set('a.b.d', 2);

	assert.deepEqual(db.diff(), {
		a: {
			old: undefined,
			new: {
				b: {
					c: 1,
					d: 2
				}
			}
		}
	});
});

test('Dot notation should not overwrite siblings even if `deepMerge` is set to false (one level, w/ written)', assert => {
	const db = makedb();

	db.set(dotbox.WRITE, {
		'a.b': 1.1,
		'a.c': 2.1
	});

	db.set('a.b', 1.2);

	assert.deepEqual(db.diff(), {
		a: {
			b: {
				old: 1.1,
				new: 1.2
			},
			c: 2.1
		}
	});

	db.set('a.c', 2.2);

	assert.deepEqual(db.diff(), {
		a: {
			old: {
				b: 1.1,
				c: 2.1
			},
			new: {
				b: 1.2,
				c: 2.2
			}
		}
	});
});

test('Dot notation should not overwrite siblings even if `deepMerge` is set to false (2 levels, w/ written)', assert => {
	const db = makedb();

	db.set('a.b.c', 1);

	assert.deepEqual(db.diff(), {
		a: {
			old: undefined,
			new: { b: { c: 1 } }
		}
	});

	db.set('a.b.d', 2);

	assert.deepEqual(db.diff(), {
		a: {
			old: undefined,
			new: {
				b: {
					c: 1,
					d: 2
				}
			}
		}
	});
});