'use strict';

const isInt = Number.isInteger;

function subdirTypeError (hasLength, path, startSegment, segmentLength) {
	const typeofPath = typeof path;
	const typeofStartSegment = typeof startSegment;
	const typeofSegmentLength = typeof segmentLength;

	let message = `usage: dotbox.subdir( path: string, startSegment: integer, segmentLength?: integer ), `;

	if (hasLength) {
		message += `got ( path: ${typeof path}, startSegment: ${typeof startSegment}, segmentLength: ${typeof segmentLength} )`;
	} else {
		message += `got ( path: ${typeof path}, startSegment: ${typeof startSegment} )`;
	}
	
	return new TypeError(message);
}

/**
 * Returns the part of a dotted path between the start index and a number of segments after it.
 * This function mimics the behavior of String.prototype.substr, but count path segments instead of characters.
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/substr
 * 
 * @example
 * subdir('aaa.bbb.ccc.ddd');        // 'aaa.bbb.ccc.ddd'
 * subdir('aaa.bbb.ccc.ddd', 1);     //     'bbb.ccc.ddd'
 * subdir('aaa.bbb.ccc.ddd', 2);     //         'ccc.ddd'
 * subdir('aaa.bbb.ccc.ddd', 0, 1);  // 'aaa'
 * subdir('aaa.bbb.ccc.ddd', -1);    //             'ddd'
 * 
 * @param {String} path The path, formatted using dot notation, to extract parts of.
 * @param {Integer} startSegment The index of the first path segment to include in the returned path.
 * @param {Integer} [segmentLength=undefined] The number of segments to extract (counting from `startSegment`).
 */
function subdir (path, startSegment, segmentLength) {
    const hasStart = startSegment !== undefined;
    const hasLength = segmentLength !== undefined;

	if (typeof path !== 'string' || !isInt(startSegment) || (hasLength && !isInt(segmentLength))) {
		throw subdirTypeError(hasLength, path, startSegment, segmentLength);
	}

    if (!hasStart) {
        return path;
    }

	const pathLength = path.length;
	const indexes = [0];

	for (let i = 0; i < pathLength; ++i) {
		if (path[i] === '.' && path[i - 1] !== '\\') {
			indexes.push(i + 1);
		}
	}

	const maxIndex = indexes.length - 1;
	const begIndex = (startSegment >= 0 ? startSegment : maxIndex + startSegment + 1);
	const endIndex = (segmentLength < 0 ? pathLength + segmentLength : segmentLength);

	if (begIndex > maxIndex || (endIndex > maxIndex && segmentLength < 0)) {
		return '';
	}
	
	const start = indexes[begIndex];

	if (!hasLength) {
		return path.substr(start);
	}

    const length = (endIndex > maxIndex ? pathLength : indexes[endIndex] - 1);

    return path.substr(start, length);
}

module.exports = subdir;
