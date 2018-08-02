// const mongoose = require('mongoose');
// const Schema = mongoose.Schema;
// const app = require('../app');
//
// const LocationSchema = new Schema({
// 	type: { type: String, default: 'Point' },
// 	coordinates: { type: [Number], index: '2dsphere' } // '[Number]' = 'an array of numbers', 'index' is the type it should use for GeoJSON.
// })
//
// const Location = mongoose.model('location', LocationSchema);
// // mongoose.connection.collection("location").createIndex({ location: "2dsphere" }) // something like this?
// module.exports = Location;
