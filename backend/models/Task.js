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
        default: 0              // 0:pending, 1:done, 2:approved
    }
});

module.exports = mongoose.model('Task', Task);