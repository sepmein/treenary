function update(db, phrase) {
    var collection = db.collection('words');

    collection.updateOne(
        {
            _id: phrase
        }, {
            $inc: {
                n: 1
            }
        }, {
            upsert: true
        }, function (err, r) {
            if (err) {
                console.log(err);
            }
        }
    );
}

module.exports = update;
