var url = require('url');
var MongoClient = require('mongodb').MongoClient
    , assert = require('assert');
// Connection URL
var dbConnectionUrl = 'mongodb://localhost:27017/treenary';
// Use connect method to connect to the Server
var Crawler = require("crawler");
//var url = require('url');
var wordAnalysis = require('./wordAnalysis');
var dbModel = require('./db');
var startClient = require('./client');

MongoClient.connect(dbConnectionUrl, function (err, db) {
    assert.equal(null, err);
    console.log("Connected correctly to server");

    startCrawler(dbModel.updater, db, dbModel.url.checker, dbModel.url.adder);

    //startClient();

});

function startCrawler(updater, db, urlChecker, urlAdder) {

    var c = new Crawler({
        maxConnections: 10,
        // This will be called for each crawled page
        callback: function (error, result, $) {
            // $ is Cheerio by default
            //a lean implementation of core jQuery designed specifically for the server

            if (error) {
                console.error(error);
            } else if (result.statusCode > 300 || result.statusCode < 200) {
                console.log('request not success, code: ' + result.statusCode);
            } else if (!$) {
                console.log('request is fine, but something happened, that $ is not defined');
            } else {
                $('a').each(function (index, a) {
                    var toQueueUrl = $(a).attr('href');

                    //TODO: 将这部分的逻辑分离至其他模块
                    /*
                     * 一些url是相对路径,比如:'/hello'
                     * 那么在处理时需要将其与页面的根url,如'http://xxx.com',合并
                     * */
                    if (!!toQueueUrl && toQueueUrl[0] === '/') {
                        toQueueUrl = url.resolve(result.uri, toQueueUrl);
                    }

                    /*
                     * 一些url只是书签,比如:'/#hello'
                     * 这些url的内容已经抓取过,无需重新抓取
                     * */
                    if (!!toQueueUrl && toQueueUrl[0] === '#') {
                        return;
                    }

                    //console.log(toQueueUrl);
                    urlChecker(db, toQueueUrl, function (result) {
                        //console.log(result);
                        if (result === true) {
                            c.queue(toQueueUrl);
                            urlAdder(db, toQueueUrl);
                        }
                    });
                });

                $('p').each(function (index, element) {
                    var list = wordAnalysis($(element).text());
                    list.forEach(function (element) {
                        if (element) {
                            updater(db, element);
                        }
                    });
                });
            }
        },
        jQuery: true,
        //skipDuplicates: true,
        forceUTF8: true,
        onDrain: function () {
            console.log('-------------');
            console.log('drained');
            console.log('-------------');
            db.close();
            console.log('-------------');
            console.log('db.close()');
            console.log('-------------');
        }
    });

// Queue just one URL, with default callback
//    c.queue('http://yahoo.com');
    //c.queue('http://harvard.edu');
    c.queue('http://www.nasa.gov');
    c.queue('http://nature.com')
}
