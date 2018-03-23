'use strict';

const {test} = require('ava');
const {subdir} = require('../');

test(assert => {
    
    const path = 'aaa.bbb.ccc.ddd.eee.fff';
    const str = 'abcdef';

    function test (start, length) {
        if (arguments.length === 1) {
            const dirResult = subdir(path, start);
            const strResult = str.substr(start).split('').map(s => s.repeat(3)).join('.');

            assert.deepEqual(dirResult, strResult, `subdir(${start}) should equal '${strResult}', not '${dirResult}'`)

        } else {
            const dirResult = subdir(path, start, length);
            const strResult = str.substr(start, length).split('').map(s => s.repeat(3)).join('.');

            assert.deepEqual(dirResult, strResult, `subdir(${start}, ${length}) should equal '${strResult}', not '${dirResult}'`)
        }
    }

    for (let i = 0; i < 8; ++i) test(i);
    for (let i = 1; i < 8; ++i) test(-i);
    for (let i = 0; i < 8; ++i) test(i, i);
    for (let i = 0; i < 8; ++i) test(-i, -i);
    for (let i = 0; i < 8; ++i) test(-i, i);
    for (let i = 0; i < 8; ++i) test(i, -i);

    for (let i = 0; i < 8; ++i) test((i + 1), i);
    for (let i = 0; i < 8; ++i) test(-(i + 1), -i);
    for (let i = 0; i < 8; ++i) test(-(i + 1), i);
    for (let i = 0; i < 8; ++i) test((i + 1), -i);

    for (let i = 0; i < 8; ++i) test(i, (i + 1));
    for (let i = 0; i < 8; ++i) test(-i, -(i + 1));
    for (let i = 0; i < 8; ++i) test(-i, (i + 1));
    for (let i = 0; i < 8; ++i) test(i, -(i + 1));

    for (let i = 0; i < 8; ++i) test((i + 2), i);
    for (let i = 0; i < 8; ++i) test(-(i + 2), -i);
    for (let i = 0; i < 8; ++i) test(-(i + 2), i);
    for (let i = 0; i < 8; ++i) test((i + 2), -i);

    for (let i = 0; i < 8; ++i) test(i, (i + 2));
    for (let i = 0; i < 8; ++i) test(-i, -(i + 2));
    for (let i = 0; i < 8; ++i) test(-i, (i + 2));
    for (let i = 0; i < 8; ++i) test(i, -(i + 2));

    test(Infinity);
    test(-Infinity);
    test(-Infinity, -Infinity);
    test(Infinity, -Infinity);

    test();
    test(null, null);
    // test(true, true);
    test(NaN, NaN);


});
