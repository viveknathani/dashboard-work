const mongoose = require('mongoose');

const Task = mongoose.Schema({
    problem: String,
    solution: String,
    by: String,
    to: String,
    deadline: Date,
    points: {
        type: Number,
        default: 0
    },
    status: {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model('Task', Task);