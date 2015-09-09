/**
 * Created by Spencer on 2015/5/10.
 */

var controller = {};

//返回最新的5条url
controller.returnLatestFiveUrls = function (db, callback) {
    var collection = db.collection('url');
    collection
        .find({})
        .sort({_id: -1})
        .limit(5)
        .toArray(callback);
};

//检查url数据的长度，如果>0返回true
controller.checkIfUrlLengthIsZero = function (db, callback) {
    var col = db.collection('url');
    col
        .count({}, function (err, result) {
            callback(err, !!result);
        });
};

controller.starter = function (db, crawlerInstance) {
    controller.checkIfUrlLengthIsZero(db, function (err, result) {
        if (result !== true) {
            crawlerInstance.queue('https://medium.com');
        } else {
            controller.returnLatestFiveUrls(db, function (err, results) {
                results.forEach(function (object, key) {
                    console.log('Latest urls were ', object);
                    crawlerInstance.queue(object.url);
                });
            });
        }
    });
};

module.exports = controller;
