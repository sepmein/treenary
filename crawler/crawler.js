var url = require('url');
var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');
// Connection URL
var mongoUrl;
if (process.env.NODE_ENV === 'production') {
  mongoUrl = 'mongodb://' + process.env.DB_PORT_27017_TCP_ADDR + '/treenary';
} else {
  mongoUrl = 'mongodb://localhost/treenary';
}
// Use connect method to connect to the Server
var Crawler = require("crawler");
var wordAnalysis = require('./analysis/wordAnalysis');
var dbCtrl = require('./db');

MongoClient.connect(mongoUrl, function (err, connection) {
  assert.equal(null, err);
  console.log("Connected correctly to server");

  startCrawler(dbCtrl.updater, connection, dbCtrl.url.checker, dbCtrl.url.adder, dbCtrl.controller.starter);

  //startClient();

});

function startCrawler(updater, connection, urlChecker, urlAdder, starter) {

  var crawlerInstance = new Crawler({
    maxConnections: 1,
    // This will be called for each crawled page
    callback: function (error, result, $) {
      //request success add request url to database
      urlAdder(connection, result.uri);

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

          /*
           * ../../../../../us/en/yahoo/terms/index.htm
           * javascript:void(0)
           *
           * 注意这种情况
           * */
          console.log(toQueueUrl);

          //如果url并未在数据库中出现
          //将其加入队列
          //并将其存入数据库
          urlChecker(connection, toQueueUrl, function (result) {
            if (result === false) {
              crawlerInstance.queue(toQueueUrl);
            }
          });
        });

        $('p').each(function (index, element) {
          var list = wordAnalysis($(element).text());
          list.forEach(function (element) {
            if (element) {
              updater(connection, element);
            }
          });
        });
      }
    },
    jQuery: true,
    //skipDuplicates: true,
    forceUTF8: true
    //,
    //onDrain: function () {
    //  console.log('-------------');
    //  console.log('drained');
    //  console.log('-------------');
    //  connection.close();
    //  console.log('-------------');
    //  console.log('db.close()');
    //  console.log('-------------');
    //}
  });

  starter(connection, crawlerInstance);
}
