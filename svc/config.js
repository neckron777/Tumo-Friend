const config = {};

config.mongo = {
    host: process.env.MONGO_HOST || "localhost",
    port: process.env.MONGO_PORT || 27017,
    dbname: process.env.MONGO_DBNAME || "TumoFriend",
}

config.jwt = {
    secret: process.env.JWT_SECRET || "test",
}

module.exports = config;