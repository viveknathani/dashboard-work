/**
 * Module for manager role in our application.
 */

const User = require('../models/User');
const Task = require('../models/Task');

const WORKER = 1; // 0 indicates manager in the DB, 1 indicates worker.

module.exports = function(app) {
    /**
     * Get list of all workers.
     */
    app.get('/manager/workers', async (req, res) => {
        try {
            let workers = [];
            await User.find({ who: WORKER })
                      .then(docs => {
                          for(let i = 0; i < docs.length; ++i) {
                              workers.push({ name: docs[i].name, email: docs[i].email });
                          }
                          workers = JSON.stringify(workers);
                      })
                      .catch(err => console.log(err));
            res.send(workers);
        }
        catch(err) {
            res.status(500).send({ message: err.message });
        }
    }); 

    /**
     * Get all tasks assigned by the manager.
     * URL parameter is manager's email.
     * Alternative solution would be to pass email into the request body but 
     * fetch() [used on frontend] does not allow body content in GET requests.
     */
    app.get('/manager/tasks/:email', async (req, res) => {
        try {
            let tasks;
            let email = req.params.email
            await Task.find({by: email})
                      .then(docs => tasks = JSON.stringify(docs))
                      .catch(err => console.log(err));
            res.send(tasks);          
        }
        catch(err) {
            res.status(500).send({ message: err.message });
        }
    });

    /**
     * Post a task with the details.
     */
    app.post('/manager/task', async (req, res) => {
        try {
            let creator = new Task({ 
                problem: req.body.problem,
                by: req.body.by,
                to: req.body.to,
                deadline: req.body.deadline,
            });
            await creator.save();
        }
        catch(err) {
            res.status(500).send({ message: err.message });
        }
    });

    /**
     * Edit/Update a task.
     */
    app.put('/manager/task', async (req, res) => {
        try {
            const { deadline, status, points, by, to, problem, solution } = req.body;
            await Task.updateOne({ _id: req.body._id }, { $set : { deadline, status, points, by, to, problem, solution } });
            res.status(201).send('Updated!');
        }
        catch(err) {
            res.status(500).send({ message: err.message });
        }
    });

    /**
     * Delete a task.
     */
    app.delete('/manager/task', async (req, res) => {
        try {
            const deleted = await Task.findByIdAndDelete(req.body._id);
            res.status(202).send({message: 'Deleted.' });
        }
        catch(err) {
            res.status(500).send({ message: err.message });
        }
    });
}