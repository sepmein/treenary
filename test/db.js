describe('Crawler', function () {
  describe('db', function () {
    var mongodb = require('mongodb'),
      mongoUrl = 'mongodb://localhost/treenary',
      MongoClient = require('mongodb').MongoClient
      , assert = require('assert');
    describe('index.js', function () {
      it('Result should equal to the original url.', function (done) {
        MongoClient.connect(mongoUrl, function (err, db) {
          var collection = db.collection('test');
          var url = 'http://facebook.com';
          collection.save({
            url: url
          }, function (err, result) {
            collection.findOne({url: url}, function (err, result) {
              assert.equal(result.url, url);
              done();
            });
          });
        });
      });
    });
    describe('controller', function () {
      describe('restarter', function () {
        it('Should find the last 5 url results', function (done) {
          MongoClient.connect(mongoUrl, function (err, db) {
            var collection = db.collection('url');
            collection
              .find({})
              .sort({_id:1})
              .limit(5)
              .toArray(function (err, result) {
                console.log(result);
                assert.equal(result.length, 5);
                done();
              });
          });
        });
      });
    });
  });
});
