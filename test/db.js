var mongodb = require('mongodb');
var mongoUrl = 'mongodb://localhost/treenary';

var MongoClient = require('mongodb').MongoClient
    , assert = require('assert');

MongoClient.connect(mongoUrl, function (err, db) {
    assert.equal(null, err);
    console.log("Connected correctly to server");

    var collection = db.collection('test');
    var url = 'http://facebook.com';
    collection.save({
        url: url
    },function(err, result){
        console.log(result);

        collection.findOne({url: url},function(err, result){
            console.log(err);
            console.log(result);
            db.close();
        });

        collection.findOne({url: url + 's'},function(err, result){
            console.log("error: " , err);
            console.log(result);
            db.close();
        });
    });

});
