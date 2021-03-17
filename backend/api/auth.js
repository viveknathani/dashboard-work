/**
 * auth.js
 * Authentication module for our application.
 */

const bcrypt    = require('bcrypt');          // For hashing passwords
const validator = require('./valid');         // For validating user input
const jwt       = require('jsonwebtoken');    // The meat of authentication in this project
const User      = require('../models/User'); 
const AGE       = 3 * 24 * 60 * 60;           // Age of JWT, 3 days, decided randomly.

/**
 * Responsible for producing JWT
 * Fields for data, {id, who, name, email}
 */
function makeToken(data) {
    return jwt.sign(data, 
                    process.env.JWT_SECRET, {
                        expiresIn: AGE
                    });
}

/**
 * Utility function to timeout when need
 * time is in milliseconds
 */
function wait(time) {
    return new Promise(r => setTimeout(r, time));
}

module.exports = function(app) {

    /**
     * Get credentials.
     * Validate user.
     * Check existence.
     * Hash the password.
     * Store in DB.
     */
    app.post('/signup', async (req, res) => {
        const { email, password, who, name } = req.body;
        const validResult = validator.validateUser(email, password, who, name);

        if(!(validResult.emailRes === 'OK' && 
             validResult.passwordRes === 'OK' && 
             validResult.whoRes === 'OK')) {
                 res.status(400).send(validResult);
                 return;
        }

        let exists = true;
        await User.find({ email: email }, (err, doc) => {
            if(err) {
                console.log(err);
            }
            if(doc.length === 0) {
                res.status(302).send({ 
                    message: 'User does not exist!'
                });
                exists = false;
                return;
            }
        });

        await wait(5);

        if(!exists) {
            const salt = 10; // Randomly decied salt, required by bcrypt
            const hashedPassword = await bcrypt.hash(password, salt);

            try {
                let creator = new User({
                    email: email,
                    password:  hashedPassword,
                    name: name,
                    who: who
                });
                await creator.save();
                res.status(201).send({message: 'User added.'});
            }
            catch(err) {
                res.status(500).send({ message: err.message });
            }
        }
    });

    /**
     * Get credentials.
     * Check existence.
     * Compare entered password with password in DB.
     * Send token.
     */
    app.post('/login', async (req, res) => {
        const { email, password } = req.body;

        let exists = true;
        await User.find({ email: email }, (err, doc) => {
            if(err) {
                console.log(err);
            }
            if(doc.length === 0) {
                res.status(302).send({ 
                    message: 'User does not exist!'
                });
                exists = false;
                return;
            }
        });

        await wait(5);

        if(exists) {
            try {
                const userObject = await User.find({ email: email });
                const passwordFromDB = userObject[0].password;
                const isGood = await bcrypt.compare(password, passwordFromDB);
    
                if(isGood) {
                    const data = {
                        _id: userObject[0]._id,
                        who: userObject[0].who,
                        email: userObject[0].email,
                        name: userObject[0].name
                    }
                    const token = makeToken(data);
                    res.status(200).send({ token });
                }
                else {
                    res.status(400).send({ message: 'Incorrect password!'});
                }
            }
            catch(err) {
                res.status(500).send({ message: err.message });
            }
        }
    });

    /**
     * Get token.
     * Verify and decode.
     * Send decoded content (which is the data object passed into makeToken).
     */
    app.post('/verifyToken', async (req, res) => {
        const { token } = req.body;
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            res.status(200).send({decoded});
        }
        catch(err) {
            res.status(400).send({err});
        }
    });
}