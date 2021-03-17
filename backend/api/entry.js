'use strict';

const databaseHandler = require('../models/setup');
const authPaths = require('./auth');
const managerPaths = require('./manager');

module.exports = function(app) {
    databaseHandler.makeConnection();

    app.get('/', (req, res) => {
        res.send('Hello from backend!');
    });

    authPaths(app);
    managerPaths(app);
}