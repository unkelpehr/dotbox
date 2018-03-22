/**
 * Number
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number
 */
'use strict';

module.exports = {
    zero: 0,
    one: 1,
    two: 2,
    
    largestNumber: Number.MAX_VALUE,
    smallestNumber: Number.MIN_VALUE,
    
    largestSafeInteger: Number.MAX_SAFE_INTEGER,
    smallestSafeInteger: Number.MIN_SAFE_INTEGER,
    
    positiveInfinity: Infinity,
    negativeInfinity: -Infinity,

    zeroObject: new Number(0),
    oneObject: new Number(1),
    twoObject: new Number(2),
    
    largestNumberObject: new Number(Number.MAX_VALUE),
    smallestNumberObject: new Number(Number.MIN_VALUE),
    
    largestSafeIntegerObject: new Number(Number.MAX_SAFE_INTEGER),
    smallestSafeIntegerObject: new Number(Number.MIN_SAFE_INTEGER),
    
    positiveInfinityObject: new Number(Infinity),
    negativeInfinityObject: new Number(-Infinity)
};
