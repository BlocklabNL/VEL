VEL DB DRAFT

TO DO LIST: DB FRAMEWORK
- Add further fields to transaction model
- Add transactions controllers to controllers file / new controllers file(s)

TO DO LIST: GENERAL
- Send data from IoT device to db via something like a web app(?)... look into IoT device(s).
- [once ^^ is done] Connect to BigchainDB

NOTES
- Look into different data formats sent by IoT devices we'd possibly test with.
- Note that the 'edit' test is using the MongoDB ID (i.e. the '_ _id')_ NOT the device ID.
- If location gets buggy: _look at the info in  'test_helper' re: 'ensureIndex({ 'location.coordinates': '2dsphere' }))'_
