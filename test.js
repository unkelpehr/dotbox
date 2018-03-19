'use strict';

const dotbox = require('./dotbox');
const datatypes = require('./datatypes');

const db = dotbox.make('');
const data2 = datatypes.get(false);

db.set('a', 'A');
db.set('b', 'B');

db.set('c.c', 'CC');
db.set('d.d', 'DD');
db.set('e.e', 'EE');

console.log(db.getChangedKeys());

let times = 1000000;
console.time('getChangedKeys');
while (times--) {
	db.getChangedKeys()
}
console.timeEnd('getChangedKeys');

return;
return db._inspect({
	written: db.getWritten(),
	changes: db.getChanges(),
	diff: db.diff()
});

data.walk((val, key, parentObject, path) => {
	if (typeof val !== 'function') {
		// console.log('set', path, typeof val);
		db.set(path, val);
	}
});

data.walk((val, key, parentObject, path) => {
	if (typeof val !== 'function') {
		console.log(path, db.get(path) === data.get(path));
	}
});

return;
return db._inspect({
	written: db.getWritten(),
	changes: db.getChanges(),
	diff: db.diff()
});



return;
const employee = dotbox.make('Employee');

employee.set(dotbox.AS_WRITTEN, {
	names: {
		first: 'Anders',
		last: 'Billfors'
	}
});

employee.set(dotbox.AS_WRITTEN, {
	phones: {
		private: 1,
		work: 2,
		office: 3
	}
});

employee.set({
	names: {
		first: 'Jonas',
		last: 'Boman'
	}
});

employee.set(true, {
	phones: {
		private: -1
	}
});

employee.set('names.nickname', 'wiz');

employee._inspect();