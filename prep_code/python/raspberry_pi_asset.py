from bigchaindb_driver import BigchainDB
from bigchaindb_driver.crypto import generate_keypair
from bigchaindb_driver.exceptions import NotFoundError
from time import sleep
from sys import exit
import logging

#CREATING OBJECT OF CLASS BIGCHAINDB
bdb_root_url = 'http://188.166.104.12:9984/'
bdb = BigchainDB(bdb_root_url)


#CRYPTOGRAHIC IDENTITIES GENERATION
Max, Ilhan, JanJoost = generate_keypair(), generate_keypair(), generate_keypair()
print('\n','\n','CREATING CRYPTOGRAHIC IDENTITIES FOR USERS')
print('- MAX\'S KEYS: ', Max)
print('- ILHAN\'S KEYS: ', Ilhan)
print('- JANJOOST\'S KEYS: ', JanJoost)

#DEFINING THE ASSET
raspberry_pi_asset = {
    'data': {
        'raspberry_pi': {
            'type': 'sense hat',
			'location': 'CIC', # in reality this would probaly be GPS coordinates... simplicity here 
			'device metric': 'temperature (celsius)'
        },
    },
}

raspberry_pi_asset_metadata = {
	'ping timestamp': 'device energy reading'
}

#each ping will add a new key:value pair to the metadata dict:
# KEY = 'timestamp'
# VALUE = 'reading from pi'
# c.f. https://stackoverflow.com/questions/1024847/add-new-keys-to-a-dictionary

print('\n','\n','DEFINING ASSET')
print('THIS IS THE DEVICE DATA: ' )
print('- RASPBERRY_PI_ASSET TYPE (DATA): ', raspberry_pi_asset['data']['raspberry_pi']['type'])
print('- RASPBERRY_PI_ASSET LOCATION (DATA): ', raspberry_pi_asset['data']['raspberry_pi']['location'])
print('- RASPBERRY_PI_ASSET DEVICE METRIC (DATA): ', raspberry_pi_asset['data']['raspberry_pi']['device metric'])
print('- RASPBERRY_PI_ASSET PING(S) (METADATA): ', raspberry_pi_asset_metadata)

#CREATING THE ASSET
prepared_creation_tx = bdb.transactions.prepare(
    operation='CREATE',
    signers=Max.public_key,
    asset=raspberry_pi_asset,
    metadata=raspberry_pi_asset_metadata
)

#THE TRANSACTION IS FULFULLED BY SIGNING BY ALICE'S KEY...
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

print('\n','\n','CREATING ASSET')
print("THIS IS THE 'CREATE TX' DATA:"  )
print('- CREATE TX VALID IN:', trials, 'SECONDS')
print('- CREATE TX INPUTS: ', sent_creation_tx['inputs'])
print('- CREATE TX OUTPUTS: ', sent_creation_tx['outputs'])
print('- FULL CREATE TX DATA: ', sent_creation_tx)

#ASSET TRANSFERRAL
# "In order to prepare the transfer transaction, we first need to know the id of the asset we’ll
# be transferring. Here, because Max is consuming a CREATE transaction, we have a special case in
# that the asset id is NOT found on the asset itself, but is simply the CREATE transaction’s id:

asset_id = txid

transfer_asset = {
    'id': asset_id
}

output_index = 0
output = fulfilled_creation_tx['outputs'][output_index]

transfer_input = {
    'fulfillment': output['condition']['details'],
    'fulfills': {
        'output_index': output_index,
        'transaction_id': fulfilled_creation_tx['id']
    },
    'owners_before': output['public_keys']
}

prepared_transfer_tx = bdb.transactions.prepare(
    operation='TRANSFER',
    asset=transfer_asset,
    inputs=transfer_input,
    recipients=Ilhan.public_key,
)

#AGAIN FULFILL THE TRANSACTION BY SIGNING...
fulfilled_transfer_tx = bdb.transactions.fulfill(
    prepared_transfer_tx,
    private_keys=Max.private_key,
)

#... AND SEND IT
sent_transfer_tx = bdb.transactions.send(fulfilled_transfer_tx)

print('\n','\n','TRANSFERRING ASSET')
print("THIS IS THE 'TRANSFER TX' DATA: " )
print('- TRANSFER TX VALID IN:', trials, 'SECONDS')
print('- TRANSFER TX INPUTS: ', sent_transfer_tx['inputs'])
print('- TRANSFER TX OUTPUTS: ', sent_transfer_tx['outputs'])
print('- FULL TRANSFER TX DATA: ', sent_transfer_tx)

print("- IS ILHAN THE NEW OWNER?",
    sent_transfer_tx['outputs'][0]['public_keys'][0] == Ilhan.public_key)

print("- WAS MAX THE PREVIOUS OWNER?",
    fulfilled_transfer_tx['inputs'][0]['owners_before'][0] == Max.public_key)

#OBTAINING ASSET IDS:
#You might have noticed that we considered Alice’s case of consuming a CREATE transaction as
#a special case. In order to obtain the asset id of a CREATE transaction, we had to use the CREATE
#transaction’s id:
#transfer_asset_id = create_tx['id']

#If you instead wanted to consume TRANSFER transactions (for example, fulfilled_transfer_tx),
# you could obtain the asset id to transfer from the asset['id'] property:
#transfer_asset_id = transfer_tx['asset']['id']

#TRANSACTION STATUS
logger = logging.getLogger(__name__)
logging.basicConfig(format='%(asctime)-15s %(status)-3s %(message)s')

bdb_root_url = 'http://188.166.104.12:9984/'
bdb = BigchainDB(bdb_root_url)

print('- THIS IS THE DELIBERATE ERROR CHECKING FOR CHECKING THE TRANSACTION STATUS OF A FALSE ASSET (BY ID): ' )

txid_false = '12345'
try:
    status = bdb.transactions.status(txid_false)
except NotFoundError as e:
    logger.error('Transaction "%s" was not found.',
                 txid,
                 extra={'status': e.status_code})
# ^^ THIS WILL RETURN AN ERROR IN THE CONSOLE

try:
    status = bdb.transactions.status(txid)
except NotFoundError as e:
    logger.error('Transaction "%s" was not found.',
                 txid,
                 extra={'status': e.status_code})
# ^^ THIS WILL NOT RETURN AN ERROR BECAUSE IT IS THE CORRECT TXID

#CREATE TOKEN FOR DEVICE RENTAL
raspberry_pi_token = {
	'data': {
		'token_for': {
	        'raspberry_pi': {
	            'type': 'sense hat'
	        },
		},
	},
	'metadata': {
		'description': 'Time share token. Each token equals one hour of use.',
	}
}

# MAX ASSIGNS 10 TOKENS TO JANJOOST
prepared_token_tx = bdb.transactions.prepare(
	operation='CREATE',
	signers=Max.public_key,
	recipients=[([JanJoost.public_key], 10)],
	asset=raspberry_pi_token
)

# FULFILLING THE TRANSACTION
fulfilled_token_tx = bdb.transactions.fulfill(
	prepared_token_tx, private_keys=Max.private_key)

#The reason why the addresses are contained in lists is because each output can have multiple
#recipients. For instance, we can create an output with amount=10 in which both Carly and Alice
#are recipients (of the same asset):
# recipients=[([JanJoost.public_key, Ilhan.public_key], 10)]

#MAX ISSUED THE TOKENS
fulfilled_token_tx['inputs'][0]['owners_before'][0] == Max.public_key
#JANJOOST OWNS 10 OF THEM
fulfilled_token_tx['outputs'][0]['public_keys'][0] == JanJoost.public_key
fulfilled_token_tx['outputs'][0]['amount'] == '10'

#JANJOOST WANTS TO RIDE FOR TWO HOURS THUS SENDS TWO TOKENS TO MAX
output_index = 0

output = prepared_token_tx['outputs'][output_index]

transfer_input = {
	'fulfillment': output['condition']['details'],
	'fulfills': {
    	'output_index': output_index,
    	'transaction_id': prepared_token_tx['id'],
	},
	'owners_before': output['public_keys'],
}

transfer_asset = {
	'id': prepared_token_tx['id'],
}

prepared_transfer_tx = bdb.transactions.prepare(
	operation='TRANSFER',
	asset=transfer_asset,
	inputs=transfer_input,
	recipients=[([Max.public_key], 2), ([JanJoost.public_key], 8)]
)
#NOTICE THAT CARLY NEEDS TO REASSIGN THE REMAINING 8 TO HERSELF - BIGCHAINDB ONLY ALLOWS FOR THE AMOUNT
#BEING CONSUMED IN EACH TRANSACTION (RE: DIVISIBLE ASSETS) IS THE SAME AS THE AMOUNT BEING OUTPUT

#ALSO NOTICE THAT BECAUSE WE'RE CONSUING A TRANSFER TRANSACTION WE CAN DIRECTLY USE THE TRANSFER TRANSACTION'S
#ASSET AS THE NEW TRANSACTION'S ASSET BECAUSE IT ALREADY CONTAINED THE ASSET'S ID

#THE FULFULLED_TRANSFER_TX DICTIONARY SHOULD HAVE TWO OUPUTS, ONE WITH 'AMOUNT=2' AND ONE 'AMOUNT=8'

fulfilled_transfer_tx = bdb.transactions.fulfill(
	prepared_transfer_tx, private_keys=JanJoost.private_key)

print('\n','\n','CREATING TOKEN FOR ACTIVITIES LIKE DEVICE RENTAL')
print('THIS IS THE TOKEN DATA: ' )
print('- THIS IS THE RASPBERRY_PI RENTAL TOKEN DATA: ', raspberry_pi_token['data'])
print('- THIS IS THE RASPBERRY_PI RENTAL TOKEN DESCRIPTION: ', raspberry_pi_token['metadata']['description'])
print('- THESE ARE THE OUTPUTS OF THE TOKEN TRANSFER TX: ', fulfilled_transfer_tx['outputs'])

#QUERYING FOR ASSETS
print('\n','\n', 'QUERYING FOR ASSETS')
print("- THIS IS THE FULL QUERY RETURN FROM THE DB WHEN SEARCHING FOR THE RASPBERRY_PI_ASSET JUST CREATED BY TXID: " ,bdb.assets.get(search=txid))
print("- THIS IS THE FULL QUERY RETURN FROM THE DB WHEN SEARCHING FOR ALL OF THE RASPBERRY_PI_ASSETS VIA A TEXT SEARCH OF 'sense hat' WITH THE QUERY LIMITED TO RETURNING THE FIRST TWO FOUND: ", bdb.assets.get(search='sense hat', limit=2))

#MAKING SHARED ASSET
shared_asset_creation_tx = bdb.transactions.prepare(
    operation='CREATE',
    signers=Max.public_key,
    recipients=(Max.public_key, Ilhan.public_key),
    asset=raspberry_pi_asset,
)

signed_shared_asset_creation_tx = bdb.transactions.fulfill(
    shared_asset_creation_tx,
    private_keys=Max.private_key
)

sent_shared_asset_tx = bdb.transactions.send(signed_shared_asset_creation_tx)
sent_shared_asset_tx == signed_shared_asset_creation_tx

output_index = 0

output = signed_shared_asset_creation_tx['outputs'][output_index]

input_ = {
    'fulfillment': output['condition']['details'],
    'fulfills': {
        'output_index': output_index,
        'transaction_id': signed_shared_asset_creation_tx['id'],
    },
    'owners_before': output['public_keys'],
}

transfer_asset = {
    'id': signed_shared_asset_creation_tx['id'],
}

shared_asset_creation_tx = bdb.transactions.prepare(
    operation='TRANSFER',
    recipients=JanJoost.public_key,
    asset=transfer_asset,
    inputs=input_,
)

signed_shared_asset_creation_tx = bdb.transactions.fulfill(
    shared_asset_creation_tx, private_keys=[Max.private_key, Ilhan.private_key]
)

#NOTICE THAT AT THE MOMENT (14/3/2018), ALL KEYS NEED TO BE PROVIDED SIMULTANEOUSLY OR THE TRANSACTION WILL FAIL.
#THEY'RE WORKING ON NON-SIMULTANEOUS PRIVATE KEY SHARING FOR TX FULFILLMENT

print('\n','\n', 'MAKING A SHARED ASSET')
print('- SEND SHARED ASSET TX INPUTS: ', sent_shared_asset_tx['inputs'])
print('- SEND SHARED ASSET TX OUTPUTS: ', sent_shared_asset_tx['outputs'])
print('- FULL SHARED ASSET TX DATA: ', sent_shared_asset_tx)
#print("- IS JANJOOST THE NEW OWNER?",
#    shared_asset_creation_tx['recipients']['public_keys'] == JanJoost.public_key)
# ^^ THIS TEST IS A LITTLE BUGGY... WILL FIX
