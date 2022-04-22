const expressSession = require("express-session");
const mongodbStore = require("connect-mongodb-session");

let mongodbUrl = 'mongodb://127.0.0.1:27017';

if (process.env.MONGODB_URL) {
    mongodbUrl = process.env.MONGODB_URL;
}

//store function
function createSessionStore() {
    const MongoDBStore = mongodbStore(expressSession);

    const sessionStore = new MongoDBStore({
        uri: mongodbUrl,
        databaseName: "online-shop",
        collection: "sessions",
    });

    return sessionStore;
}

//function session attach metadata
function createSessionConfig() { //store parameter
    return {
        secret: "super-secret eroge collection store",
        resave: false,
        saveUninitialized: false,
        store: createSessionStore(),
        cookie: {
            maxAge: 2 * 24 * 60 * 60 * 1000,
        },
    }
}

module.exports = createSessionConfig;

/* const expressSession = require('express-session');
const mongoDbStore = require('connect-mongodb-session');

function createSessionStore(expressSession) {
    const MongoDBStore = mongoDbStore(expressSession);

    const store = new MongoDBStore({
        uri: 'mongodb://127.0.0.1:27017',
        databaseName: 'online-shop',
        collection: 'sessions'
    });

    return store;
}

function createSessionConfig(sessionStore) {
    return {
        secret: 'super-secret',
        resave: false,
        saveUninitialized: false,
        store: sessionStore,
        cookie: {
            maxAge: 2 * 24 * 60 * 60 * 1000
        }
    };
}

module.exports = {
    sessionKey: createSessionStore,
    headerKey: createSessionConfig
}; */

