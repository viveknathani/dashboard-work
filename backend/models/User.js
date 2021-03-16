const mongoose = require('mongoose');

const User = mongoose.Schema({
    email: String,
    password: String,
    name: String,
    who: Number // 0 for Manager, 1 for Worker
});

module.exports = mongoose.model('User', User);