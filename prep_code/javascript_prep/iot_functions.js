/*
@dev below are the functions to connect to the above node, called from the device.
This code will be run on the device in order to keep the keys safe and remove any need for http(s) requests.
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
function registerDevice() {
	// define(<model name>,<additional information>)
	// <model name>: represents the name of model you want to store
	// <additional inf.>: any information you want to pass about the model (can be string or object)
	// note: cannot be changed once set!
	bdbOrm.define("myModel", "https://schema.org/v1/myModel")

	// create a public and private key for DEVICE OWNER from a randomly created mnemonic
	var mnemonic = bip39.generateMnemonic()
	const maxKeyPair = new BigchainDB.Ed25519Keypair(bip39.mnemonicToSeed(mnemonic).slice(0, 32))
	console.log("BEGINNING REGISTRATION...")
	console.log(`\nMNEMONIC: ${mnemonic}`)
	console.log(`\nPUBLIC KEY: ${maxKeyPair.publicKey}`)
	console.log(`\nPRIVATE KEY: ${maxKeyPair.privateKey}`)
	console.log("KEEP THESE KEYS SAFE & NEVER SHARE THEM")
	// ***** CREATE *****
	// from the defined models in our bdbOrm we create an asset with Max as owner
	bdbOrm.models.myModel
	    .create({
	        keypair: maxKeyPair,
	        data: { deviceType: 'Pi',
					deviceReading: 'temperature',
					readingMetric: 'degrees celcius',
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
			console.log(`\n\nASSET CREATED\n\nASSET ID: ${asset.id}  \nASSET TYPE: ${asset.data.deviceType} \nASSET READING: ${asset.data.deviceReading} \nMEASUREMENT METRIC:${asset.data.readingMetric}`)
			deviceID = asset.id;
	})
}

function deviceInfo(deviceID) {
	// ***** RETRIEVE *****
	// get all objects with retrieve() or get a specific object with retrieve(object.id)
	bdbOrm.models.myModel
	    .retrieve(deviceID)
	    .then(assets => {
	        // assets is an array of myModel
	        console.log(assets.map(asset => asset.id))
			console.log(asset.transactionHistory)
	    })
}

function update(deviceID, time, newReading) {
	// ***** APPEND *****
	// "Update" (Database) => "Append" (Blockchain)
	// create an asset with Max as owner
	bdbOrm.models.myModel
		.retrieve(deviceID)
	    .then(asset => {
	        return asset.append({
	            toPublicKey: maxKeyPair.publicKey,
	            keypair: maxKeyPair,
				data: { deviceType: 'Pi',
						deviceReading: 'temperature',
						readingMetric: 'degrees celcius',
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
	            keypair: maxKeyPair
	        })
	    })
	    .then(burnedAsset => {
	        // asset is now tagged as "burned"
	        console.log(`\n BURNED ASSET DATA: ${burnedAsset.data}`)
	    })
}
