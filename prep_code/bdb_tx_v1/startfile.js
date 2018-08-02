const BigchainDB = require('bigchaindb-driver')
const Orm = require('bigchaindb-orm')
var bip39 = require('bip39')

const API_PATH = 'https://test.bigchaindb.com/api/v1/'
const conn = new BigchainDB.Connection(API_PATH, {
    app_id: '9725558a',
    app_key: 'a004a86b3b89d6c551f17a1addc38b78'
})

const ilhan = new BigchainDB.Ed25519Keypair(bip39.mnemonicToSeed('seedPhrase').slice(0,32))

console.log('Ilhan: ', ilhan.publicKey)


class DID extends Orm {
    constructor(entity) {
        super(
            API_PATH, {
                app_id: '9725558a',
                app_key: 'a004a86b3b89d6c551f17a1addc38b78'
            }
        )
        this.entity = entity
    }
}

const car = new BigchainDB.Ed25519Keypair()
const sensorGPS = new BigchainDB.Ed25519Keypair()

const userDID = new DID(ilhan.publicKey)
const carDID = new DID(car.publicKey)
const gpsDID = new DID(sensorGPS.publicKey)

userDID.define("myModel", "https://schema.org/v1/myModel")
carDID.define("myModel", "https://schema.org/v1/myModel")
gpsDID.define("myModel", "https://schema.org/v1/myModel")

userDID.myModel.create({
    keypair: ilhan,
    data: {
        name: 'ilhan',
        bithday: '12/05/1980'
    }
}).then(asset => {
    userDID.id = 'did:' + asset.id
    document.body.innerHTML +='<h3>Transaction created</h3>'
    document.body.innerHTML +=asset.id
})

const vehicle = {
    value: '6sd8f68sd67',
    power: {
      engine: '2.5',
      hp: '220 hp',
    },
    consumption: '10,8 l'
  }

carDID.myModel.create({
    keypair: ilhan,
    data: {
        vehicle
    }
}).then(asset => {

    console.log('The TxId:',asset)
    carDID.id = 'did:' + asset.id
    document.body.innerHTML +='<h3>Transaction created</h3>'
    document.body.innerHTML +=txTelemetrySigned.id
    console.log('The TxId:',asset.id )
})

gpsDID.myModel.create({
    keypair: car,
    data: {
        gps_identifier: 'a32bc2440da012'
    }
}).then(asset => {
    gpsDID.id =  'did:' + asset.id
    document.body.innerHTML +='<h3>Transaction created</h3>'
    document.body.innerHTML +=txTelemetrySigned.id

})