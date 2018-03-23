'use strict';

/**
 * Returns the part of a dotted path between the start index and a number of segments after it.
 * This function mimics the behavior of String.prototype.substr, but count segments instead of characters.
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/substr
 * @param {String} path The dotted path to slice up
 * @param {Integer} startSegment The index of the first path segment to include in the returned path.
 * @param {Integer} [segmentLength=undefined] The number of segments to extract.
 */
function subdir (path, startSegment, segmentLength) {
    const hasStart = startSegment !== undefined;
    const hasLength = segmentLength !== undefined;

    if (!hasStart) {
        return path;
    }

	const pathLength = path.length;
	const indexes = [0];

	for (let i = 0; i < pathLength; ++i) {
		if (path[i] === '.') { // && path[i - 1] !== '\\'
			indexes.push(i + 1);
		}
	}

	const maxIndex = indexes.length - 1;
	const begIndex = (startSegment >= 0 ? startSegment : maxIndex + startSegment + 1);
	const endIndex = (segmentLength < 0 ? pathLength + segmentLength : segmentLength);

	if (begIndex > maxIndex || (endIndex > maxIndex && segmentLength < 0)) {
		return '';
	}
	
	const start = isNaN(startSegment) ? 0 : indexes[begIndex];

	if (!hasLength) {
		return path.substr(start);
	}

    const length = isNaN(segmentLength) ? 0 : (endIndex > maxIndex ? pathLength : indexes[endIndex] - 1);

    return path.substr(start, length);
}

module.exports = subdir;
