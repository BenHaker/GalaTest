const MongoClient = require('mongodb').MongoClient
const serverUrlId = "serverUrl";

module.exports = {
    seedDB: function(serverUrl) {
        console.log("seedDB with serverUrl=" + serverUrl);
        MongoClient.connect('mongodb://localhost:27017', function(err, database) {
            if(err != null)
                console.log(err);
            else {
                let col = database.db("test").collection("urls");
                col.find({ id: serverUrlId }).toArray(function(err, items) {
//First time the DB is loaded
                    if(items == null || items.length == 0)
                        col.insert([{ id: serverUrlId, url: serverUrl }], function(err, result) {
                            database.close();
                        });
                    else
                        database.close();
                })
            }
    })},
    getServerUrl: function(callback) {
        MongoClient.connect('mongodb://localhost:27017', function(err, database) {
            if(err != null)
                console.log(err);
            else {
                let col = database.db("test").collection("urls");
                col.find({ id: serverUrlId }).toArray(function(err, items) {
                    callback(items[0].url);
                })
            }
        })
    }
 }