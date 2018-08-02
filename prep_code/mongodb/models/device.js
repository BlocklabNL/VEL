const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const TransactionSchema = require('./transaction');

// const PointSchema = new Schema({
// 	type: { type: String, default: 'Point '},
// 	location: { type: [Number], index: '2dsphere' } // '[Number]' = 'an array of numbers', 'index' is the type it should use for GeoJSON.
// })

const DeviceSchema = new Schema({
	deviceName: {
		type: String,
		required: false
	},
	deviceLocation: { type: {type:String}, coordinates: [ Number ] },
	deviceOwners: {
		type: String,
		required: false
	},
	deviceType: {
		type: String,
		required: false
	},
	deviceMetadata: {
		type: String,
		required: false
	},
	transactionList: [{
		type: Schema.Types.ObjectId,
		ref: 'transaction'
	}]
})

mongoose.connection.collection("location").createIndex({ location: "2dsphere" })
const Device = mongoose.model('device', DeviceSchema);
module.exports = Device;
