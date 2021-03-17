/**
 * Module for Worker role in our application.
 */

const User = require('../models/User');
const Task = require('../models/Task');

module.exports = function(app) {
    /**
     * Get tasks (paginated) assigned to a worker.
     */
    app.get('/worker/tasks/:email/:page/:limit', async (req, res) => {
        try {
            let tasks;
            let page = req.params.page;
            let limit = req.params.limit;
            await Task.find({to: req.params.email})
                      .then(docs => {
                          if(page <= 0) {
                              page = 1;
                          }
                          if(limit <= 0) {
                              limit = docs.length;
                          }
                          let start = (page - 1) * limit;
                          let end = page * limit;
                          docs = docs.slice(start, end);
                          tasks = JSON.stringify(docs);
                        })
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