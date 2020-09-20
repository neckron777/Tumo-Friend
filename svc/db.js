const mongoose = require("mongoose");
const config = require("./config");

const host = config.mongo.host;
const port = config.mongo.port;
const dbName = config.mongo.dbname;

const url = `mongodb://${host}:${port}/${dbName}`;


class DB {
    constructor() {}

    static disconnect () {
        mongoose.disconnect();
    }
    static async connectAsync() {
        async function connectToDB() {
            return new Promise((resolve, reject) => {
                mongoose.connect(url, 
                    {
                        useCreateIndex: true,
                        useNewUrlParser: true,
                        useFindAndModify: false,
                        useUnifiedTopology: true,
                    },(err) => {
                        if (err) {
                            reject(err);
                        }
                        else{
                            console.log(`Mongoose: Connected to MongoDB Server ${url}`);
                            resolve({status: 0});
                        }
                    })
            })
        } 

        await connectToDB();
    }
}

module.exports = DB;