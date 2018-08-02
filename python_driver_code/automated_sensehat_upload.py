from sense_hat import SenseHat
import time
import datetime

from bigchaindb_driver import BigchainDB
from bigchaindb_driver.crypto import generate_keypair
from bigchaindb_driver.exceptions import NotFoundError
from time import sleep
from sys import exit
import logging

# DO INITIAL CREATE TRANSACTION WHERE YOU GENERATE THE KEYS OF THE OWNER
# THEN THE PI FALLS INTO A 'WHILE TRUE' LOOP TO CONSTANTLY APPEND THE METADATA
# WITH NEW DATA... ASSET IS IN THE BIGCHAIN DB NODE THEN...

sense = SenseHat()
sense.clear()

UPLOAD = True #easy on-off toggle
PUSH_TIME = 600 #seconds

print('BEGINNING INITIAL CREATION SETUP', '\n')

#CREATING OBJECT OF CLASS BIGCHAINDB
from bigchaindb_driver import BigchainDB
tokens = {}
tokens['app_id'] = '3b959424'
tokens['app_key'] = '30c12a0e15343d705a7e7ccb6d75f1c0'
bdb = BigchainDB('https://test.bigchaindb.com', headers=tokens)

#CRYPTOGRAHIC IDENTITIES GENERATION
print('CREATING CRYPTOGRAHIC IDENTITY FOR USER...')
Max = generate_keypair()
print('- private key: ', Max.private_key)
print('- public key: ', Max.public_key)

print('\n')

#DEFINING THE ASSET
raspberry_pi_asset = {
    'data': {
        'raspberry_pi': {
            'type': 'sense hat',
	    'location': 'CIC', # in reality this would probaly be GPS coordinates... simplicity here
	    'device metric': 'temperature (celsius)' # allows for searching-by-metric (e.g. 'query for all devices that read temperature')
        },
    },
}

a = (str(datetime.datetime.now()))
DATE = a.replace('.', ':') # need to do this because the key of the metadata cannot contain a '.' character. Replace it with ':'

raspberry_pi_asset_metadata = {DATE : str(sense.get_temperature())} # created with initial temperature reading and timestamp

#CREATING THE ASSET
prepared_creation_tx = bdb.transactions.prepare(
    operation='CREATE',
    signers=Max.public_key,
    asset=raspberry_pi_asset,
    metadata=raspberry_pi_asset_metadata
)

#THE TRANSACTION IS FULFULLED BY SIGNING BY MAX'S KEY...
fulfilled_creation_tx = bdb.transactions.fulfill(
    prepared_creation_tx,
    private_keys=Max.private_key
)

#...AND SENT TO A BIGCHAINDB NODE
sent_creation_tx = bdb.transactions.send(fulfilled_creation_tx)

#CHECKING THAT THE RESPONSE FROM THE NODE IS THAT WHICH WAS SENT
txid = fulfilled_creation_tx['id']

#THIS KEEPS CHECKING THE STATUS OF THE TRANSACTION UNTIL IT IS (IN)VALID AND PRINTS TIME VALID TRANSACTION TOOK
trials = 0
while trials < 60:
    try:
        if bdb.transactions.status(txid).get('status') == 'valid':
            break
    except bigchaindb_driver.exceptions.NotFoundError:
        trials += 1
        sleep(1)

if trials == 60:
    print('Tx is still being processed... Bye!')
    exit(0)

print('CREATING ASSET...')
print('...ASSET CREATION VALID IN:', trials, 'SECONDS')
print('TX INPUTS: ', sent_creation_tx['inputs'])
print('TX OUTPUTS: ', sent_creation_tx['outputs'])
print('\n')

## print data from transaction 'successfully added to Bigchain db' sort of thing...
print('ASSET SUCCESSFULLY REGISTERED')
print('\n')
print('----------------------------------------------------')
print('BEGINNING DATA APPEND LOOP - NO FURTHER ACTION REQUIRED')

##BELOW IS THE PART OF THE CODE THAT RUNS ON A LOOP AND UPDATES THE METADATA
while True:
    if UPLOAD:
        time.sleep(PUSH_TIME)
        print('sending data to BigchainDB...')

    ## APPEND METADATA TRANSACTION GOES HERE
        print('...data sent to BigchinDB successfully. ASSET METADATA: ')
## return asset metadata to check its appended properly
        print('\n')
        print('----------------------------------------------------')
        print('\n')

##c.f. https://github.com/johnwargo/pi_weather_station/blob/master/weather_station.py
##^^ can be used to optimize the temperature readings but no real use right now
