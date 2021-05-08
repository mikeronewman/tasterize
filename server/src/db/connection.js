const monk = require('monk');

// change this to process.env.DB_URL to deploy
let dbUrl = process.env.TEST_DB_URL;

const db = monk(dbUrl);

module.exports = db;
