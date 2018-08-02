const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const routes = require('./routes/routes');
const app = express(); // this is our express application

mongoose.Promise = global.Promise;
if(process.env.NODE_ENV !== 'test') { // 'if we're not running in test environment then connect to this db, if we are then dont connect to it at all' - see package.json for more details
mongoose.connect('mongodb://localhost/vel_db_draft')
console.log(`connected to mongodb://localhost/vel_db_draft`);
}

app.use(bodyParser.json()); // 'any incoming request, assume it is JSON and parse it into an object'
routes(app); // set up all the different routes in our app - kind of like middleware

app.use((err, req, res, next) => { // define error handling middleware afterwards so it is always executed after the route assignment above
	res.status(422).send({ error: err.message }); // manually set error status because otherwise it comes through misleadingly as 'status: 200 (ok)'
});
/*
'err' is if previous middleware threw an error - equal to the error object that was thrown
'req' & 'res' are the same - incoming request object and outgoing response object
'next' is a FUNCTION that is called to forcibly go to the next middleware in the chain
*/

module.exports = app;

// http://188.166.104.12:9984/ is droplet API 
