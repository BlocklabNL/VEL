const dotenv = require('dotenv')
require('dotenv').config()
const express = require('express');
const app = express();
const HTTP_WEBPORT = process.env.HTTP_WEBPORT;
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended:true}))

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

// bigchaindb routes - one per function
require("../routes/standard_login.js")(app, bdbOrm) // standard express server management
require("../routes/uport_login.js")(app, bdbOrm) // add uport when added
require("../routes/register_device.js")(app, bdbOrm)
require("../routes/device_info.js")(app, bdbOrm)
require("../routes/update.js")(app, bdbOrm)
require("../routes/burn.js")(app, bdbOrm)

app.listen(HTTP_WEBPORT, () => console.log(`app listening on port ${HTTP_WEBPORT}`))
console.log("BigchainDB connection details:")
console.log(bdbOrm.connection)
