'use strict';

const dotbox = require('./dotbox');

const db = dotbox.make('');

const datatypes = require('./datatypes');

const data = datatypes.get(false);


// db.set('Number.smallestSafeIntegerObject', data.get('Number.smallestSafeIntegerObject'));

// console.log('Number.smallestSafeIntegerObject', db.get('Number.smallestSafeIntegerObject'));

/* db.set(dotbox.AS_WRITTEN, {
	'a.b': 1.1,
	'a.c': 2.1
});

db.set('a.b', 1.2);

db.set(dotbox.DEEP_MERGE, 'a', {
	d: 3
}); */

db.set(dotbox.AS_WRITTEN, {
	'a.b': 1.1,
	'a.c': 2.1
});

db.set('a.b', 1.2);

return db._inspect({
	written: db.getWritten(),
	changes: db.getChanges(),
	diff: db.diff()
});

//return db._inspect({
//	written: db.getWritten(),
//	changes: db.getChanges(),
//	diff: db.diff()
//});
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