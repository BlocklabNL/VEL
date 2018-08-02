const Device = require('../models/device');
const Location = require('../models/location');
const Transaction = require('../models/transaction');

module.exports = {

	ping(req, res) {
		res.send({ ping: "pinging" });
	},

	create(req, res, next) {
		const deviceInfo = req.body; // info used to register device

		Device.create(deviceInfo)
			.then(device => res.send(`registration successful for device. Reciept: ${device}`))
			.catch(next); // error handling with 'next' function for middleware
	},

	edit(req, res, next) {
		const deviceId = req.params.id; // the ':id' from the incoming http . 'params' object can have multiple objects atop it if we're pulling mulitple values from an incoming object
		const deviceInfo = req.body;

		Device.findByIdAndUpdate({ _id: deviceId }, deviceInfo) // pass in object of an id to find, and how you want to update
			.then(() => Device.findById({ _id: deviceId })) // promise is called with an object of statistics of what records where updated so we find the driver that has been updated ...
			.then(device => res.send(`edit successful for device. Updated device info: ${device}`)) // ... and send it back in this subsequent promise
			.catch(next);
	},

	delete(req, res, next) {
	const deviceId = req.params.id;

	Device.findByIdAndRemove({ _id: deviceId })
		.then(device => res.status(204).send(`Device deleted successfully. Deleted device was: ${device}`)) // send back deleted request as confirmation with http status of 204 which means 'the record was successfully deleted'
		.catch(next);
	},

	id(req, res, next) {
		const deviceId = req.params.id;

		Device.findById({ _id: deviceId })
			.then(device => res.send(`Device location is: ${device.deviceLocation.coordinates}`))
			.catch(next);
	}

	// index(req, res, next) {

	// this is an action for finding by location... probably won't use it but just leaving it in here just in case
	// need to write a test for this if we end up using it

  	// 	const { lng, lat } = req.query;
	//
	// 	Device.find({
	// 		'geometry coordinates': {
	// 			$nearSphere: {
	// 				$geometry: {
	// 					type: 'Point',
	// 					coordinates: [lng, lat]
	// 				},
	// 				$maxDistance: 200000
	// 			}
	// 		}
	// 	})
	// 		.then(device => res.send(`DEVICE LOCATION: ${device.deviceLocation.coordinates}`))
	// 		.catch(next);
	// }

}
