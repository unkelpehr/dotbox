/**
 * Arguments object
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/arguments
 */
'use strict';

function args () {
	return arguments;
}

module.exports = {
	empty: args(),

	filledWithFalsyValues: args(0, '', false, null, undefined, NaN),

	filledWith5undefined: args(
		undefined,
		undefined,
		undefined,
		undefined,
		undefined
	),

	// Filled in the end.
	filledWithEverything: []
};
