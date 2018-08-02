const app = require('./app');

app.listen(3000, () => {
	console.log('running on port 3000') // express app is listening to http requests on port 3050
});
