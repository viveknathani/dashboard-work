const mongoose = require('mongoose');
const mongoServerPath = `mongodb://localhost:27017/${process.env.DB_NAME}`;
const mongoOptions = {
    useNewUrlParser: true, 
    useUnifiedTopology: true
};

function makeConnection() {
    mongoose.connect(mongoServerPath, mongoOptions)
            .then(() => {
                console.log('Connected to database.');
            })
            .catch(err => {
                console.log('Database connection error.');
                console.log(err);
            });
}

module.exports = {
    makeConnection: makeConnection
}