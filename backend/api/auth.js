const bcrypt = require('bcrypt');
const validResult = require('./valid');
const jwt    = require('jsonwebtoken');
const User = require('../models/User');
const AGE    = 3 * 24 * 60 * 60;

function makeToken(id) {
    return jwt.sign({ id }, 
                    process.env.JWT_SECRET, {
                        expiresIn: AGE
                    });
}

module.exports = function(app) {
    app.post('/signup', async (req, res) => {
        const { email, password, who, name } = req.body;
        const validResult = validator.validateUser(email, password, who, name);

        if(!(validResult.emailRes === 'OK' && 
             validResult.passwordRes === 'OK' && 
             validResult.whoRes === 'OK')) {
                 console.log(validResult);
                 res.status(400).send(validResult);
                 return;
        }

        User.exists({ email: email }, (err, res) => {
            if(err) {
                console.log(err);
            }
            if(res === true) {
                res.status(302).send({ 
                    message: 'User exists!'
                });
                return;
            }
        });

        const salt = 10;
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
    });

    app.post('/login', async (req, res) => {
        const { email, password } = req.body;

        User.exists({ email: email }, (err, res) => {
            if(err) {
                console.log(err);
            }
            if(res !== true) {
                res.status(302).send({ 
                    message: 'User does not exist!'
                });
                return;
            }
        });

        try {
            const userObject = await User.find({ email: email });
            const passwordFromDB = userObject[0].password;
            const isGood = await bcrypt.compare(password, passwordFromDB);

            if(isGood) {
                const token = makeToken(userObject._id);
                res.status(200).send({ token });

            }
            else {
                res.status(400).send({ message: 'Incorrect password!'});
            }
        }
        catch(err) {
            res.status(500).send({ message: err.message });
        }
    });

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