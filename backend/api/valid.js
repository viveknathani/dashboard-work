/**
 * Contains functions for validating user input.
 * Regex is not written by me. 
 */

function checkEmail(email) {
    const regex  = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const result = regex.test(email);
    return result;
}

function checkPassword(password) {
    const regex  = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    const result = regex.test(password);
    return result;
}

function checkWho(who) {
    return (who === 0 || who === 1);
}

function validateUser(email, password, who) {
    const emailRes    = checkEmail(email);
    const passwordRes = checkPassword(password);
    const whoRes      = checkWho(who);
    let   result      = { emailRes : 'OK', passwordRes : 'OK', whoRes : 'OK' };

    if(!emailRes)    { 
        result.emailRes = 'Incorrect email format.'; 
    }

    if(!passwordRes) { 
        result.passwordRes = 'Password format : Minimum eight characters, at least one letter and one number'; 
    }

    if(!whoRes) {
        result.whoRes = 'Incorrect user type.';
    }

    return result;
}

module.exports = {
    validateUser : validateUser
}