const dotenv = require('dotenv');
const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const path = require("path");
const BigchainDB = require('bigchaindb-driver');
const bip39 = require('bip39');
const Orm = require('bigchaindb-orm').default; //for some reason the Orm needs '.default'... cf. https://github.com/bigchaindb/js-driver-orm/issues/43
const db = require(path.resolve( __dirname, "../config/db.js" ));

require('dotenv').config();
const HTTP_WEBPORT = process.env.HTTP_WEBPORT;
const HTTPS_WEBPORT = process.env.HTTPS_WEBPORT;
app.use(bodyParser.urlencoded({extended:true}));

/* LINK TO NODE - currently testnet */
const bdbOrm = new Orm(
    "https://test.bigchaindb.com/api/v1/",
    {
		app_id: '3b959424',
		app_key: '30c12a0e15343d705a7e7ccb6d75f1c0'
    }
)

// bigchaindb routes - one per function
require("../routes/standard_login.js")(app, bdbOrm, bcrypt) // standard express server management of users via SQL db. 
require("../routes/uport_login.js")(app, bdbOrm) // add uport object when option is added
require("../routes/register_device.js")(app, bdbOrm)
require("../routes/device_info.js")(app, bdbOrm)
require("../routes/update.js")(app, bdbOrm)
require("../routes/burn.js")(app, bdbOrm)

db.sequelize.sync({
    force: false, // 'true' drops all tables on app restart for development. 'false' for production!
    logging: console.log
}).then(()=> {
  app.listen(HTTP_WEBPORT, () => console.log(`app listening on port ${HTTP_WEBPORT} \nTHIS IS AN INSECURE HTTP CONNECTION \nUSE HTTPS CONNECTION IN PRODUCTION`))
  //app.listen(HTTPS_WEBPORT, () => console.log(`app listening on port ${HTTPS_WEBPORT}`))
  console.log("BIGCHAINDB CONNECTION DETAILS:")
  console.log(bdbOrm.connection)
})
