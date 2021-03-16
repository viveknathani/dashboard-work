const mongoose = require('mongoose');

const Task = mongoose.Schema({
    status: {
        Number,
        default: 0
    },
    problem: String,
    solution: String,
    by: String,
    to: String,
    deadline: Date,
    points: {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model('Task', Task);