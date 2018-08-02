
/*
@dev below are the functions to connect to the above node, called from the device.
This code will be run on the device in order to keep the keys safe and remove any need for http(s) requests.
These functions will have to be called by an interface layer that is designed at a later date.
*/

/* LINK TO NODE - currently testnet */
const BigchainDB = require('bigchaindb-driver')
const bip39 = require('bip39')
//for some reason the Orm needs '.default'... cf. https://github.com/bigchaindb/js-driver-orm/issues/43
const Orm = require('bigchaindb-orm').default

const bdbOrm = new Orm(
    "https://test.bigchaindb.com/api/v1/",
    {
		app_id: '3b959424',
		app_key: '30c12a0e15343d705a7e7ccb6d75f1c0'
    }
)

/*GLOBAL VARIABLES*/
var deviceID;

/*FUNCTIONS*/
function registerDevice(_deviceType, _deviceReading, _readingMetric, _location) {

	console.log("BEGINNING REGISTRATION...")
	bdbOrm.define("myModel", "https://schema.org/v1/myModel")

	// create a public and private key for DEVICE OWNER from a randomly created mnemonic
	var mnemonic = bip39.generateMnemonic()
	const keys = new BigchainDB.Ed25519Keypair(bip39.mnemonicToSeed(mnemonic).slice(0, 32))
	console.log(`\nMNEMONIC: ${mnemonic}`)
	console.log(`\nPUBLIC KEY: ${keys.publicKey}`)
	console.log(`\nPRIVATE KEY: ${keys.privateKey}`)
	console.log("KEEP THESE KEYS SAFE & NEVER SHARE THEM")
	console.log("...REGISTRATION FINISHED")

	// create the asset
	bdbOrm.models.myModel
	    .create({
	        keypair: keys,
	        data: { deviceType: _deviceType,
					deviceReading: _deviceReading,
					readingMetric: _readingMetric,
					location: _location,
					lastReadingTime: 'n/a',
					lastReadingOutput: 'n/a'
				},
	    })
	    .then(asset => {
	        /*
	            asset is an object with all our data and functions
	            asset.id equals the id of the asset
	            asset.data is data of the last (unspent) transaction
	            asset.transactionHistory gives the full raw transaction history
	            Note: Raw transaction history has different object structure then
	            asset. You can find specific data change in metadata property.
	        */
			console.log(`\n\nASSET CREATED\n\nASSET ID: ${asset.id}  \nASSET TYPE: ${asset.data.deviceType}
				\nASSET READING: ${asset.data.deviceReading} \nMEASUREMENT METRIC:${asset.data.readingMetric}`)
			deviceID = asset.id;
	})
}

function deviceInfo(modelName, deviceID) {
	bdbOrm.models.modelName
	    .retrieve(deviceID)
	    .then(assets => {
	        // assets is an array of myModel
	        console.log(assets.map(asset => asset.id))
			console.log(asset.transactionHistory)
	    })
}

function update(deviceID, time, newReading) {
	bdbOrm.models.myModel
		.retrieve(deviceID)
	    .then(asset => {
	        return asset.append({
	            toPublicKey: keys.publicKey,
	            keypair: keys,
				data: { deviceType: asset.data.deviceType,
						deviceReading: asset.data.deviceReading,
						readingMetric: asset.data.readingMetric,
						location: _location,
						lastReadingTime: time,
						lastReadingOutput: newReading
					},
			})
	    })
	    .then(updatedAsset => {
	        // updatedAsset contains the last (unspent) state
	        // of our asset so any actions
	        // need to be done to updatedAsset
	        console.log(`\n...updated \'data\' key:value pair\nUPDATED ASSET DATA: ${updatedAsset.data}`)
	    })
}

function burn(deviceID) {
	bdbOrm.models.myModel
		.retrieve(deviceID)
		.then(asset => {
	        // lets burn the asset by assigning to a random keypair
	        // since will not store the private key it's infeasible to redeem the asset
	        return asset.burn({
	            keypair: keys
	        })
	    })
	    .then(burnedAsset => {
	        // asset is now tagged as "burned"
	        console.log(`\n BURNED ASSET DATA: ${burnedAsset.data}`)
	    })
}
