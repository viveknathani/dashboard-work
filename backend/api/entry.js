'use strict';

const databaseHandler = require('../models/setup');
const authPaths = require('./auth');

module.exports = function(app) {
    databaseHandler.makeConnection();

    app.get('/', (req, res) => {
        res.send('Hello from backend!');
    });

    authPaths(app);
}