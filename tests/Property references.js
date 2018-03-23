'use strict';

const { test } = require('ava');
const dotbox = require('../');

const makedb = () => dotbox.createDocument('test');

function getTestData () {
    return {
        fooA: {
            barA: {
                quxA: 'fooA.barA.quxA',
                quxB: 'fooA.barA.quxB',
                quxC: 'fooA.barA.quxC'
            },

            barB: {
                quxA: 'fooA.barB.quxA',
                quxB: 'fooA.barB.quxB',
                quxC: 'fooA.barB.quxC'
            },

            barC: {
                quxA: 'fooA.barC.quxA',
                quxB: 'fooA.barC.quxB',
                quxC: 'fooA.barC.quxC'
            },
        },

        fooB: {
            barA: {
                quxA: 'fooB.barA.quxA',
                quxB: 'fooB.barA.quxB',
                quxC: 'fooB.barA.quxC'
            },

            barB: {
                quxA: 'fooB.barB.quxA',
                quxB: 'fooB.barB.quxB',
                quxC: 'fooB.barB.quxC'
            },

            barC: {
                quxA: 'fooB.barC.quxA',
                quxB: 'fooB.barC.quxB',
                quxC: 'fooB.barC.quxC'
            },
        },

        fooC: {
            barA: {
                quxA: 'fooC.barA.quxA',
                quxB: 'fooC.barA.quxB',
                quxC: 'fooC.barA.quxC'
            },

            barB: {
                quxA: 'fooC.barB.quxA',
                quxB: 'fooC.barB.quxB',
                quxC: 'fooC.barB.quxC'
            },

            barC: {
                quxA: 'fooC.barC.quxA',
                quxB: 'fooC.barC.quxB',
                quxC: 'fooC.barC.quxC'
            },
        },
    };
}

const refmess = (function () {
	function isObjectObject(thingy) {
		return (
			thingy != null &&
			typeof thingy === 'object' &&
			Array.isArray(thingy) === false &&
			Object.prototype.toString.call(thingy) === '[object Object]'
		);
	}

	function isPlainObject (thingy) {
		if (!thingy || !isObjectObject(thingy)) {
			return false;
		}

		const ctor = thingy.constructor;

		// If has modified constructor
		if (!ctor || typeof ctor !== 'function') {
			return false;
		}

		const prot = ctor.prototype;

		// If has modified prototype
		if (!prot || !isObjectObject(prot)) {
			return false;
		}

		// If constructor does not have an Object-specific method
		if (!prot.hasOwnProperty('isPrototypeOf')) {
			return false;
		}

		// Most likely a plain Object
		return true;
	};

	return function refmess (object, allObjects, _seen) {
		if (!isPlainObject(object)) {
			return;
		}

		var seen = _seen || [];

		var key;
		var val;
		
		for (key in object) {
			val = object[key];

			if (isPlainObject(val) || (allObjects && typeof val === 'object')) {
				if (~seen.indexOf(val)) {
					continue;
				}

				seen.push(val);
				refmess(val, allObjects, seen);
				val.refmess = 'refmess';
			} else {
				object[key] = 'refmess';
			}
		}
	};
}());

/*------------------------------------*\
	DEREFERENCE ON.
\*------------------------------------*/
test('Make sure input changes are dereferenced.', assert => {
    const db = makedb();
    const input = getTestData();

    db.set(input);
    refmess(input);
    assert.deepEqual(db.changes, getTestData());
});

// test('Make sure output changes are dereferenced.', assert => {
//     const db = makedb();
//     const input = getTestData();

//     db.set(input);
//     refmess(db.changes);
//     assert.deepEqual(db.changes, input);
// });

test('Make sure input writes are dereferenced.', assert => {
    const db = makedb();
    const input = getTestData();

    db.set(db.WRITE, input);
    refmess(input);
    assert.deepEqual(db.get(false), getTestData());
});

test('Make sure output writes are dereferenced.', assert => {
    const db = makedb();
    const input = getTestData();

    db.set(db.WRITE, input);
    refmess(db.get(false));
    assert.deepEqual(db.get(false), input);
});

/*------------------------------------*\
	DEREFERENCE OFF.
\*------------------------------------*/