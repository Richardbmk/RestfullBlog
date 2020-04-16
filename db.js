const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
require('dotenv').config()
const url = process.env.DB_URL_CLOUD;
const dbName = 'restfulblog';
const mongoOptions = {userNewUrlParser : true}


//console.log(process.env);

const state = {
    db : null
};

const connect = (cb) => {
    if(state.db)
        cb();
    else{
        MongoClient.connect(url, mongoOptions, (err, client)=>{
            if(err)
                cb(err);
            else{
                state.db = client.db(dbName);
                cb();
            }
        });
    }
}

const getPrimaryKey = (_id) => {
    return ObjectID(_id);
}

const getDB = () => {
    return state.db;
}

module.exports = {getDB, connect, getPrimaryKey};

