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

// define(<model name>,<additional information>)
// <model name>: represents the name of model you want to store
// <additional inf.>: any information you want to pass about the model (can be string or object)
// note: cannot be changed once set!
bdbOrm.define("myModel", "https://schema.org/v1/myModel")
// create a public and private key for Alice
const maxKeyPair = new bdbOrm.driver.Ed25519Keypair()

// ***** CREATE *****
// from the defined models in our bdbOrm we create an asset with Max as owner
bdbOrm.models.myModel
    .create({
        keypair: maxKeyPair,
        data: { key: 'Max' },
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
		console.log(asset.transactionHistory)
		// console.log(`\n\nASSET CREATED\n\nASSET ID: ${asset.id}  \nASSET DATA: ${asset.data.key} \nASSET TX HISTORY: ${asset.transactionHistory}`)
    })

// ***** RETRIEVE *****
// get all objects with retrieve() or get a specific object with retrieve(object.id)
bdbOrm.models.myModel
    .retrieve("3b959424:abce9a96-2b14-4957-8913-47fad64db6f5")
    .then(assets => {
        // assets is an array of myModel
        console.log(assets.map(asset => asset.id))
    })

// ***** APPEND *****
// "Update" (Database) => "Append" (Blockchain)
// create an asset with Max as owner
bdbOrm.models.myModel
    .create({
        keypair: maxKeyPair,
        data: { key: 'dataValue' },
    })
    .then(asset => {
        // lets append update the data of our asset
        // since we use a blockchain, we can only append
        return asset.append({
            toPublicKey: maxKeyPair.publicKey,
            keypair: maxKeyPair,
            data: { key: 'Max Hampshire' },
        })
    })
    .then(updatedAsset => {
        // updatedAsset contains the last (unspent) state
        // of our asset so any actions
        // need to be done to updatedAsset
        console.log(`\n...updated \'data\' key:value pair\nUPDATED ASSET DATA: ${updatedAsset.data.key}`)
    })

// ***** BURN *****
// "Delete" (Database) => "Burn" (Blockchain)
// create an asset with Max as owner
bdbOrm.models.myModel
    .create({
        keypair: maxKeyPair,
        data: { key: 'dataValue' }
    })
    .then(asset => {
        // lets burn the asset by assigning to a random keypair
        // since will not store the private key it's infeasible to redeem the asset
        return asset.burn({
            keypair: maxKeyPair
        })
    })
    .then(burnedAsset => {
        // asset is now tagged as "burned"
        console.log(`\n BURNED ASSET DATA: ${burnedAsset.data.key}`)
    })
