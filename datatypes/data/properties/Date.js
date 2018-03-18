/**
 * Date
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date
 */
'use strict';

function getDate (days) {
    var date = new Date();

    date.setHours(12);
    date.setMinutes(45);
    date.setSeconds(30);
    date.setMilliseconds(500);

    date.setDate(date.getDate() + days);

    return date;
}

module.exports = {
    today: getDate(0),
    tomorrow: getDate(1),
    yesterday: getDate(-1),

    // http://ecma-international.org/ecma-262/5.1/#sec-15.9.1.1
    largestDate: new Date(8640000000000000),
    smallestDate: new Date(-8640000000000000),
    invalidDate: new Date('')
};
