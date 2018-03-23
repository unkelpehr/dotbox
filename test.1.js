'use strict';

const Benchmark = require('benchmark');
const suite = new Benchmark.Suite;

const dotbox = require('./dotbox');

function getTestData() {
	const testData = {
		a: 'b',
		c: {
			d: { e: 'cde', f: 'cdf' },
			b: { c: { bla: 'blo' } }
		},
		c: {
			d: { e: 'cde', f: 'cdf' },
			b: { c: { bla: 'blo' } }
		},

		circFoo: {
			circBar: null
		},

		circFoo2: {},
		circFoo3: {},
		array: ['a', 'b', 'c', 'd'],
		circArray: []
	};

	testData.circFoo.circBar = testData.circFoo;

	testData.circFoo2.circFoo3 = testData.circFoo3;
	testData.circFoo3.circFoo2 = testData.circFoo2;

	return testData;
};



function dir1 (path, begin, end) {
	let i = 0;

	const length = path.length;

	let beginIndex = 0;
	let endIndex = length;

	// equivalent:
	// ['a', 'b', 'c'].slice(-2) => ['b', 'c']
	if (begin < 0) {
		let i = length;
		let hits = 0;

		while (i--) {
			if (path[i] === '.' && (++hits + begin === 0)) {
				beginIndex = i + 1;
				break;
			}
		}
	} else if (begin > 0) {
		let i = 0;
		let hits = 0;

		for (; i < length; ++i) {
			if (path[i] === '.' && ++hits === begin) {
				beginIndex = i + 1;
				break;
			}
		}
	}

	if (end < 0) {
		let i = length;
		let hits = 0;

		while (i--) {
			if (path[i] === '.' && (++hits + end === 0)) {
				endIndex = i;
				break;
			}
		}
	} else if (end > 0) {
		let i = 0;
		let hits = 0;

		for (; i < length; ++i) {
			if (path[i] === '.' && ++hits === end) {
				endIndex = i;
				break;
			}
		}
	}

	// console.log({
	// 	begin,
	// 	end,
	// 	beginIndex,
	// 	endIndex
	// })

	return path.slice(beginIndex, endIndex);
}

function dir3 (path, beginSegmentIndex, endSegmentLength) {
	const pathLength = path.length;
	const argsLength = arguments.length;

	// No beginSegmentIndex set.
	if (argsLength < 2) {
		return path;
	}

	let len = pathLength;

	const indexes = [0];
	for (let i = 0; i < pathLength; ++i) {
		if (path[i] === '.') {
			indexes.push(i + 1);
		}
	}

	let beginIndex = 0;
	let endIndex = pathLength;

	beginIndex = (beginSegmentIndex >= 0 ? beginSegmentIndex : indexes.length + beginSegmentIndex);

	if (beginIndex < 0) {
		beginIndex = -Infinity;
	} else if (beginIndex >= indexes.length) {
		beginIndex = (beginSegmentIndex < 0 ? -Infinity : Infinity) ;
	} else {
		beginIndex = indexes[beginIndex];
	}

	if (argsLength < 3) {
		return path.substr(beginIndex);
	}

	endIndex = (endSegmentLength < 0 ? pathLength + endSegmentLength : endSegmentLength);

	if (endIndex < 0) {
		endIndex = Infinity;
	} else if (endIndex >= indexes.length) {
		endIndex = (endSegmentLength < 0 ? -Infinity : Infinity) ;
	} else {
		endIndex = indexes[endIndex] - 1;
	}

	// console.log({
	// 	beginSegmentIndex,
	// 	endSegmentLength,
	// 	beginIndex,
	// 	endIndex
	// })
	return path.substr(beginIndex, endIndex);

	if (Math.max(beginSegmentIndex, endSegmentLength) + Math.min(beginSegmentIndex, endSegmentLength) <= 0) {
		return '';
	}



	// if (endSegmentLength === 0 || beginSegmentIndex > endSegmentLength || (endSegmentLength < 0 && beginSegmentIndex - endSegmentLength <= 0)) {
	// // if (endSegmentLength === 0 || (endSegmentLength < 0 && beginSegmentIndex - endSegmentLength <= 0)) {
	// 	return '';
	// }

	if (beginSegmentIndex > 0) {
		let i = 0;
		let hits = 0;
		
		beginIndex = Infinity;

		for (; i < pathLength; ++i) {
			if (path[i] === '.') {
				if (++hits === beginSegmentIndex) {
					beginIndex = i + 1;
					break;
				}
			}
		}
	} else if (beginSegmentIndex < 0) {
		let i = pathLength;
		let hits = 0;

		beginIndex = -Infinity;

		while (i--) {
			if (path[i] === '.') {
				if (--hits === beginSegmentIndex) {
					beginIndex = (i - (pathLength - 1));
					break;
				}
			}
		}
	}

	// No endSegmentLength set.
	if (argsLength < 3) {
		return path.substr(beginIndex);
	}

	if (endSegmentLength < 0) {
		let i = pathLength;
		let hits = 0;

		endIndex = Infinity;

		while (i--) {
			if (path[i] === '.' && (++hits + endSegmentLength === 0)) {
				endIndex = i;
				break;
			}
		}
	} else if (endSegmentLength > 0) {
		let i = 0;
		let hits = 0;

		endIndex = -Infinity;

		for (; i < pathLength; ++i) {
			if (path[i] === '.' && ++hits === endSegmentLength) {
				endIndex = i;
				break;
			}
		}
	}

	return path.substr(beginIndex, endIndex);
}

function dir2(path, begin, end) {
	const segments = path.split('.');

	if (begin < 0) {
		begin = segments.length + begin;
	}

	if (end < 0) {
		end = segments.length + end;
	}

	return segments.slice(begin, end);
}

function test_dir (dir) {
	const path = 'aaa.bbb.ccc.ddd.eee.fff';
	const str = 'abcdef';

	function test (start, length) {
		if (arguments.length === 1) {
			const dirResult = dir(path, start);
			const strResult = str.substr(start).split('').map(s => s.repeat(3)).join('.');

			if (dirResult === strResult) {
				// console.log(`    OK: dir(${start}) equals '${dirResult}'`);
			} else {
				console.log(`NOT OK: dir(${start}) should equal '${strResult}', not '${dirResult}'`);
			}
		} else {
			const dirResult = dir(path, start, length);
			const strResult = str.substr(start, length).split('').map(s => s.repeat(3)).join('.');

			if (dirResult === strResult) {
				// console.log(`    OK: dir(${start}, ${length}) equals '${dirResult}'`);
			} else {
				console.log(`NOT OK: dir(${start}, ${length}) should equal '${strResult}', not '${dirResult}'`);
			}
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
}

console.log(dir3('aaa.bbb.ccc.ddd.eee.fff', -6, -6));

test_dir(dir3)

return;

suite.add('dir1', () => {
	dir1('aaa.bbb.ccc.ddd.eee', -1)
});

suite.add('dir2', () => {
	dir2('aaa.bbb.ccc.ddd.eee', -1)
});

suite.on('cycle', function (event) {
	console.log(String(event.target));
});

suite.on('complete', function () {
	const fastest = this.filter('fastest')[0];
	const slowest = this.filter('slowest')[0];

	console.log('');
	console.log('Fastest is ' + this.filter('fastest').map('name'));

	if (slowest) {
		const perc = Math.round((((fastest.hz / slowest.hz) - 1) * 100) * 10) / 10;

		console.log(`${fastest.name} is ${perc}% faster than ${slowest.name}`);
	}
});

suite.run({ 'async': true });