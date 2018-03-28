'use strict';

const { test } = require('ava');
const { set, flags } = require('../');

function testSet (assert, bitmask, target, source, expectation) {
	target = set(bitmask, target, source);

	assert.deepEqual(target, expectation);
}

test('Replace', assert => {
	let target;

	// -------------------------------------
	testSet(assert, 0, {
		
	},{
		
	},{

	});
	
	// -------------------------------------
	testSet(assert, 0,
	{ // target
		a: 0,
		b: 0,
		c: 0
	},{ // source
		a: 'a',
/*		b: 'b', */
		c: 'c',
		d: 'd'
	},{ // expectation
		a: 'a',
		b: 0,
		c: 'c',
		d: 'd'
	});
	
	// -------------------------------------
	testSet(assert, 0,
	{ // target
		a: {
			bla: 'bar'
		},
		b: {
			bli: 'blo',
			tok: 'mos'
		},
		c: {
			tjo: 'foo'
		}
	},{ // source
		a: 'a',
/*		b: 'b', */
		c: 'c',
		d: {
			tivoli: 'circus'
		}
	},{ // expectation
		a: 'a',
		b: {
			bli: 'blo',
			tok: 'mos'
		},
		c: 'c',
		d: {
			tivoli: 'circus'
		}
	});
});

test('Shallow merge', assert => {
	let target;

	// -------------------------------------
	testSet(assert, flags.SMERGE, {
		
	},{
		
	},{

	});
	
	// -------------------------------------
	testSet(assert, flags.SMERGE,
	{ // target
		a: 0,
		b: 0,
		c: 0
	},{ // source
		a: 'a',
//		b: 'b',
		c: 'c',
		d: 'd'
	},{ // expectation
		a: 'a',
		b: 0,
		c: 'c',
		d: 'd'
	});
	
	// -------------------------------------
	testSet(assert, flags.SMERGE,
	{ // target
		a: {
			bla: 'bar'
		},
		b: {
			bli: 'blo',
			tok: 'mos'
		},
		c: {
			tjo: 'foo'
		}
	},{ // source
		a: 'a',
//		b: 'b',
		c: 'c',
		d: {
			tivoli: 'circus'
		}
	},{ // expectation
		a: 'a',
		b: {
			bli: 'blo',
			tok: 'mos'
		},
		c: 'c',
		d: {
			tivoli: 'circus'
		}
	});
	
	// -------------------------------------
	testSet(assert, flags.SMERGE,
	{ // target
		a: {
			a1: 'a1'
		},
		b: {
			b1: 'b1',
			b2: 'b2'
		},
		c: {
			c1: 'c1',
			c2: 'c2',
			c3: 'c3',
		}
	},{ // source
		a: {},
//		b: 'b',
		c: {
//			c1: 'c1',
			c2: 'c2 - 2',
			c3: 'c3 - 2',
			c4: 'c4',
		},
		d: {
			d1: 'd1',
			d2: 'd2',
		}
	},{ // expectation
		a: {
			a1: 'a1'
		},
		b: {
			b1: 'b1',
			b2: 'b2'
		},
		c: {
			c1: 'c1',
			c2: 'c2 - 2',
			c3: 'c3 - 2',
			c4: 'c4',
		},
		d: {
			d1: 'd1',
			d2: 'd2',
		}
	});
	
	// -------------------------------------
	testSet(assert, flags.SMERGE,
	{ // target
	},{ // source
		a: {},
		b: 'b',
		c: {
			c1: 'c1',
			c2: 'c2 - 2',
			c3: 'c3 - 2',
			c4: 'c4',
		},
		d: {
			d1: 'd1',
			d2: 'd2',
		}
	},{ // expectation
		a: {},
		b: 'b',
		c: {
			c1: 'c1',
			c2: 'c2 - 2',
			c3: 'c3 - 2',
			c4: 'c4',
		},
		d: {
			d1: 'd1',
			d2: 'd2',
		}
	});
});


test('Deep merge - shallow data', assert => {
	let target;

	// -------------------------------------
	testSet(assert, flags.DMERGE, {
		
	},{
		
	},{

	});
	
	// -------------------------------------
	testSet(assert, flags.DMERGE,
	{ // target
		a: 0,
		b: 0,
		c: 0
	},{ // source
		a: 'a',
//		b: 'b',
		c: 'c',
		d: 'd'
	},{ // expectation
		a: 'a',
		b: 0,
		c: 'c',
		d: 'd'
	});
	
	// -------------------------------------
	testSet(assert, flags.DMERGE,
	{ // target
		a: {
			bla: 'bar'
		},
		b: {
			bli: 'blo',
			tok: 'mos'
		},
		c: {
			tjo: 'foo'
		}
	},{ // source
		a: 'a',
//		b: 'b',
		c: 'c',
		d: {
			tivoli: 'circus'
		}
	},{ // expectation
		a: 'a',
		b: {
			bli: 'blo',
			tok: 'mos'
		},
		c: 'c',
		d: {
			tivoli: 'circus'
		}
	});
	
	// -------------------------------------
	testSet(assert, flags.DMERGE,
	{ // target
		a: {
			a1: 'a1'
		},
		b: {
			b1: 'b1',
			b2: 'b2'
		},
		c: {
			c1: 'c1',
			c2: 'c2',
			c3: 'c3',
		}
	},{ // source
		a: {},
//		b: 'b',
		c: {
//			c1: 'c1',
			c2: 'c2 - 2',
			c3: 'c3 - 2',
			c4: 'c4',
		},
		d: {
			d1: 'd1',
			d2: 'd2',
		}
	},{ // expectation
		a: {
			a1: 'a1'
		},
		b: {
			b1: 'b1',
			b2: 'b2'
		},
		c: {
			c1: 'c1',
			c2: 'c2 - 2',
			c3: 'c3 - 2',
			c4: 'c4',
		},
		d: {
			d1: 'd1',
			d2: 'd2',
		}
	});
	
	// -------------------------------------
	testSet(assert, flags.DMERGE,
	{ // target
	},{ // source
		a: {},
		b: 'b',
		c: {
			c1: 'c1',
			c2: 'c2 - 2',
			c3: 'c3 - 2',
			c4: 'c4',
		},
		d: {
			d1: 'd1',
			d2: 'd2',
		}
	},{ // expectation
		a: {},
		b: 'b',
		c: {
			c1: 'c1',
			c2: 'c2 - 2',
			c3: 'c3 - 2',
			c4: 'c4',
		},
		d: {
			d1: 'd1',
			d2: 'd2',
		}
	});
});

test('Deep merge - deep data', assert => {
	// -------------------------------------
	testSet(assert, flags.DMERGE,
	{ // target
		a: {
			a1: {
				a1: 'a1',
				a2: 'a2',
				a3: 'a3',
			},
			b1: {
				b1: 'b1',
				b2: {
					a: 'a',
					b: 'b',
					c: 'd',
				},
				b3: 'b3',
			},
		},
		b: {
			c: {
				d: {
					e: 'e'
				}
			}
		}
	},{ // source
		a: {
			a1: {
				a1: 'a1 - 2',
//				a2: 'a2 - 2',
				a3: 'a3 - 2',
			},
			b1: {
//				b1: 'b1 - 2',
				b2: {
					a: 'a - 2',
//					b: 'b - 2',
					c: 'd - 2',
					more: {
						stuff: false,
						campari: true
					}
				},
				b3: 'b3 - 2',
			},
		},
		b: {
			c: {
				d: {
					e: 'e - 2',
				},
				d2: {},
				d3: null
			}
		},
		c: {
			c1: 'c1',
			c2: {
				yes: 'hi again'
			}
		}
	},{ // expectation
		a: {
			a1: {
				a1: 'a1 - 2',
				a2: 'a2',
				a3: 'a3 - 2',
			},
			b1: {
				b1: 'b1',
				b2: {
					a: 'a - 2',
					b: 'b',
					c: 'd - 2',
					more: {
						stuff: false,
						campari: true
					}
				},
				b3: 'b3 - 2',
			},
		},
		b: {
			c: {
				d: {
					e: 'e - 2',
				},
				d2: {},
				d3: null
			}
		},
		c: {
			c1: 'c1',
			c2: {
				yes: 'hi again'
			}
		}
	});
});


test('Combinations', assert => {

	const target = {};


	testSet(assert, flags.DMERGE, target, {
		a: 1,
		b: {},
	},{
		a: 1,
		b: {},
	});
	
	testSet(assert, flags.DMERGE, target, {
		a: 1,
		b: {
			a: 1,
			b: 2
		},
	},{
		a: 1,
		b: {
			a: 1,
			b: 2
		},
	});

	testSet(assert, flags.SMERGE, target, {
		b: {
			a: 1,
			b: 2,
			c: 3
		},
	},{
		a: 1,
		b: {
			a: 1,
			b: 2,
			c: 3
		},
	});

	testSet(assert, 0, target, {
		a: null,
		b: null,
	},{
		a: null,
		b: null,
	});
	

	testSet(assert, 0, target, {
		a: {
			a: 1
		},
		b: {
			b: 1
		},
	},{
		a: {
			a: 1
		},
		b: {
			b: 1
		},
	});
});