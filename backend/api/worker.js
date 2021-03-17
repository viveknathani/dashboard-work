/**
 * Module for Worker role in our application.
 */

const User = require('../models/User');
const Task = require('../models/Task');

module.exports = function(app) {
    /**
     * Get all tasks assigned to a worker.
     */
    app.get('/worker/tasks/:email', async (req, res) => {
        try {
            let tasks;
            await Task.find({to: req.params.email})
                      .then(docs => tasks = JSON.stringify(docs))
                      .catch(err => console.log(err));
            res.send(tasks);
        }
        catch(err) {
            res.status(500).send({ message: err.message });
        }
    });

    /**
     * Submit a task.
     */
    app.put('/worker/submit', async (req, res) => {
        try {
            await Task.updateOne({ _id: req.body._id }, { $set : { solution: req.body.solution, status: 1 } });
            res.status(201).send('Updated!');
        }
        catch(err) {
            res.status(500).send({ message: err.message });
        }
    });

    /**
     * Edit worker profile.
     */
    app.put('/worker/profile', async (req, res) => {
        try {
            await User.updateOne({ _id: req.body._id }, { $set : { name: req.body.name } });
            res.status(201).send('Updated!');
        }
        catch(err) {
            res.status(500).send({ message: err.message });
        }
    });
}