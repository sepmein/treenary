/**
 * Created by Spencer on 15/4/24.
 */

/*
 * To check and store the URL processed
 * */

var url = {};

/*
 * @dependencies collection, url, callback
 * @callback true if found, false if not
 * */
url.checker = function (db, url, callback) {
    var collection = db.collection('url');
    collection.findOne(
        {
            url: url
        }, function (err, result) {
            //console.log(result);
            if (!result) {
                callback(false);
            } else {
                callback(true);
            }
        }
    );
};

url.adder = function (db, url) {
    //console.log('url add called, url: ', url);
    var collection = db.collection('url');
    collection.save(
        {
            url: url
        }, function (err, results) {
            if (err) {
                console.log(err);
            } else {
                //console.log(results);
            }
        }
    );
};

module.exports = url;
