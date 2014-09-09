var MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://127.0.0.1:27017/gleaner', function(err, database) {
    if (err) {
        console.log(err);
    } else {
        var db = require('gleaner-data').db;
        db.setDB(database);
        var users = require('gleaner-data').users;
        var conf = require('./app/configuration');
        users.setSalt(conf.passwordsSalt);
        users.insert({
            name: 'admin',
            password: 'admin',
            role: 'admin'
        }).then(function() {
            db.close();
            console.log('Done');
        });
    }
});