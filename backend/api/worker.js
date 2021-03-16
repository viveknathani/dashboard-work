const User = require('../models/User');
const Task = require('../models/Task');

module.exports = function(app) {
    app.get('/worker/tasks', (req, res) => {
        try {
            let tasks;
            await Task.find({by: req.body.email})
                      .then(docs => tasks = JSON.stringify(docs))
                      .catch(err => console.log(err));
            res.send(tasks);
        }
        catch(err) {
            res.status(500).send({ message: err.message });
        }
    });

    app.put('/worker/submit', (req, res) => {
        try {
            await Task.updateOne({ _id: req.body._id }, { $set : { solution: req.body.solution } });
            res.status(201).send('Updated!');
        }
        catch(err) {
            res.status(500).send({ message: err.message });
        }
    });

    app.put('/worker/profile', (req, res) => {
        try {
            await Task.updateOne({ _id: req.body._id }, { $set : { name: req.body.name } });
            res.status(201).send('Updated!');
        }
        catch(err) {
            res.status(500).send({ message: err.message });
        }
    });
}