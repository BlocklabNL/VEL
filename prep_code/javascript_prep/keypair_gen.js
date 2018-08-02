const BigchainDB = require('bigchaindb-driver')
const bip39 = require('bip39')
const Orm = require('bigchaindb-orm').default

const bdbOrm = new Orm(
    "https://test.bigchaindb.com/api/v1/",
    {
		app_id: '3b959424',
		app_key: '30c12a0e15343d705a7e7ccb6d75f1c0'
    }
)

bdbOrm.define("myModel", "https://schema.org/v1/myModel")

var mnemonic = bip39.generateMnemonic()
const keys = new BigchainDB.Ed25519Keypair(bip39.mnemonicToSeed(mnemonic).slice(0, 32))
console.log(`\n\nMNEMONIC: ${mnemonic}`)
console.log(`\n\nPUBLIC KEY: ${keys.publicKey}`)
console.log(`\n\nPRIVATE KEY: ${keys.privateKey}`)

// add recovery option for generating new keypair from mnemonic (saved by user) via mnemonicToSeed()!
