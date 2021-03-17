/**
 * entry.js
 * - Is the starting point for the API.
 * - Is responsible for making connection to MongoDB.
 */

'use strict';

const databaseHandler = require('../models/setup');
const authPaths       = require('./auth');
const managerPaths    = require('./manager');
const workerPaths     = require('./worker');

module.exports = function(app) {
    databaseHandler.makeConnection();

    app.get('/', (req, res) => {
        res.send('Hello from backend!');
    });

    // Handle all other paths, subject to growth, feature-wise.
    authPaths(app);
    managerPaths(app);
    workerPaths(app);
}