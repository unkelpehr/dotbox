'use strict';

const { test } = require('ava');
const dotbox = require('../');

const WRITTEN_DATA = Object.freeze({
    a: { b: 1.1 },
    c: { d: { e: 1.1 } },
    f: { g: { h: { i: 1.1 } } }
});

const makedb = () => dotbox.make('test').set(dotbox.AS_WRITTEN, WRITTEN_DATA);

function reftest (parent) {

}

test('Make sure changes are dereferenced.', assert => {
    const db = makedb();

    const data = {
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

    db.set(data);

    assert.deepEqual(db.getChanges(false), data);

});

