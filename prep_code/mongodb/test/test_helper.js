const mongoose = require('mongoose');

before(done => {
	mongoose.connect('mongodb://localhost/vel_test'); // made a test db so we can drop it constantly whenever running tests. This also stops mocha from running until the connection has been made.
	mongoose.connection
		.once('open', () => {
			console.log("connected to vel_test db")
			done()
		})
		.on('error', err => {
			console.warn('Warning', error);
		});
});

beforeEach(done => {
	const { devices, locations, transactions } = mongoose.connection.collections;
	Promise.all([ devices.drop(), transactions.drop() ]) // whenever you drop a collection you also drop all of the indexes - geometry requires its own index
		.then(() => device.ensureIndex({ 'location.coordinates': '2dsphere' })) // this makes sure that before the tests are run that an index is in place over the geometry.coordinates property of the drivers collection
		.then(() => done())
		.catch(() => done());
});
