const User = require('../models/User');
const Task = require('../models/Task');

module.exports = function(app) {
    app.get('/manager/workers', async (req, res) => {
        try {
            let workers = [];
            await User.find({ who: 1 })
                      .then(docs => {
                          console.log(docs);
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

    app.post('/manager/task', async (req, res) => {
        try {
            let creator = new Task({ 
                problem: req.body.problem,
                by: req.body.by,
                to: req.body.to,
                deadline: req.body.deadline
            });
            await creator.save();
        }
        catch(err) {
            res.status(500).send({ message: err.message });
        }
    });

    app.put('/manager/task', async (req, res) => {
        try {
            await Task.updateOne({ _id: req.body.upObject._id }, { $set : req.body.upObject });
            res.status(201).send('Updated!');
        }
        catch(err) {
            res.status(500).send({ message: err.message });
        }
    });

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