const assert = require('assert');
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../app');

const Device = mongoose.model('device'); // do it like this as sometimes mongoose, express, and mocha don't work well together. Fine to do it as per outside of our test environment.

describe('Device controller', () => {
	it('POST to /register creates a new device', done => {
		Device.count().then(count => {
			request(app)
				.post('/register')
				.send({ deviceName: 'test' })
				.end(() => {
					Device.count().then(newCount => {
						assert(count + 1 === newCount);
						done();
					});
				});
		});
	});

	it('PUT to /edit/:id edits an existing device', done => {
		const device = new Device({ deviceName: 'test', deviceOwners: 'max' });

		device.save().then(() => {
			request(app)
				.put(`/edit/${device._id}`) // which url we're trying to access
				.send({ deviceOwners: 'ilhan' }) // data we're sending along inside the request
				.end(() => { // '.end' is what actually 'sends' the request off
					Device.findOne({ deviceName: 'test' })
						.then(device => {
							assert(device.deviceOwners === 'ilhan'); // note that assert is always looking for truthy/falsey value unless otherwise specified (like here, where we've specified 'true')
							done();
						})
				});
		});
	});

	it('DELETE to /delete/:id can delete a device', done => {
		const device = new Device({ deviceName: 'test' });

		device.save().then(() => {
			request(app)
				.delete(`/delete/${device._id}`)
				.end(() => {
					Device.findOne({ deviceName: 'test' })
						.then((device) => {
							assert(device === null);
							done();
						})
				});
		});
	});

	it('GET to /location/:id finds device according to an _id', done => {
		const testOne = new Device({
			deviceName: 'One',
			deviceLocation: { type: 'Point', coordinates: [-122, 47] }
		});

		const testTwo = new Device({
			deviceName: 'Two',
		 	deviceLocation: { type: 'Point', coordinates: [-80, 25] }
		});

		Promise.all([testOne.save(), testTwo.save()])
			.then(() => {
				request(app)
					Device.findOne({ deviceName: 'One' })
						.then((device) => {
							let deviceId
							console.log(`THIS IS THE ID: ${device._id}`)
							console.log(`THIS IS THE LOCATION ${device.deviceLocation.coordinates}`)
							console.log(`THIS IS THE WHOLE LOG OF THE RETURNED DEVICE${device}`)
							assert(device.deviceName === 'One')
							done();
					});
			});
		});

});
