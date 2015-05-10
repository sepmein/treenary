/**
 * Created by Spencer on 15/4/24.
 */

/*
* Provide the entrance of each db functions
* */


var db = {};
db.updater = require('./updater');
db.url = require('./url');
db.controller = require('./controller');
module.exports = db;
