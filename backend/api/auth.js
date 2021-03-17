const bcrypt = require('bcrypt');
const validator = require('./valid');
const jwt    = require('jsonwebtoken');
const User = require('../models/User');
const AGE    = 3 * 24 * 60 * 60;

function makeToken(id, who, email) {
    return jwt.sign({ id, who, email }, 
                    process.env.JWT_SECRET, {
                        expiresIn: AGE
                    });
}

function wait(time) {
    return new Promise(r => setTimeout(r, time));
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

        await User.exists({ email: email }, (err, res) => {
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

        console.log(email, password);

        let exists = true;
        await User.find({ email: email }, (err, doc) => {
            if(err) {
                console.log(err);
            }
            console.log(doc);
            if(doc.length === 0) {
                res.status(302).send({ 
                    message: 'User does not exist!'
                });
                console.log('Sent 302');
                exists = false;
                return;
            }
        });

        await wait(5);

        if(exists) {
            try {
                const userObject = await User.find({ email: email });
                const passwordFromDB = userObject[0].password;
                console.log('Password from DB: ', passwordFromDB);
                const isGood = await bcrypt.compare(password, passwordFromDB);
    
                console.log(userObject);
    
                if(isGood) {
                    const token = makeToken(userObject[0]._id, userObject[0].who, userObject[0].email);
                    console.log(token);
                    res.status(200).send({ token });
                    console.log('Sent 200');
                }
                else {
                    res.status(400).send({ message: 'Incorrect password!'});
                    console.log('Sent 400');
                }
            }
            catch(err) {
                res.status(500).send({ message: err.message });
                console.log('Sent 500');
            }
        }
    });

    app.post('/verifyToken', async (req, res) => {
        const { token } = req.body;
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            console.log(decoded);
            res.status(200).send({decoded});
        }
        catch(err) {
            res.status(400).send({err});
        }
    });
}