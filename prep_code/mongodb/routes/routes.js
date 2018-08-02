const DeviceController = require('../controllers/device_controller');

module.exports = (app) => {
	app.get('/ping', DeviceController.ping);
	app.post('/register', DeviceController.create);
	app.put('/edit/:id', DeviceController.edit); // when having an incoming put request, we need to know which device record we're trying to modify. The ID is by convention is in the url itself, represented by the ':id' in the http route which is automatically parsed by express
	app.delete('/delete/:id', DeviceController.delete);
	app.get('/device/:id', DeviceController.id)
	// app.get('/location/:id', DeviceController.index)
		// this is for searching for devices via a location... not sure if we'd use it much
		//convention is that the route handler that returns a list of records an 'index' function
};
