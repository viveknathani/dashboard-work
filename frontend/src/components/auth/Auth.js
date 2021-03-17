import React from 'react';

function radioInput(radioName) {
    const array = document.getElementsByName(radioName);
    for(let i = 0; i < array.length; i++) {
        if(array[i].checked) {
            return array[i];
        }
    }
}

const commonHeaders  =  { 'Content-Type': 'application/json' }

class Auth extends React.Component {

    constructor(props) {
        super(props);
        this.login = this.login.bind(this);
        this.signup = this.signup.bind(this);
    }

    async login() {
        let email = document.getElementById("login_email").value;
        let password = document.getElementById("login_password").value;
        let response = await fetch('/login', {
            method: 'POST',
            headers: commonHeaders,
            body: JSON.stringify({email, password })
        });
        let data = await response.json();
        localStorage.setItem("token", data.token);
        if(response.status === 201) {
            document.getElementById("login_server_response").innerText = "Success!";
        }
        window.location.reload();
    }

    async signup() {
        let email = document.getElementById("signup_email").value;
        let name = document.getElementById("name").value;
        let password = document.getElementById("signup_password").value;
        let who = parseInt(radioInput("who").value);
        let response = await fetch('/signup', {
            method: 'POST',
            headers: commonHeaders,
            body: JSON.stringify({email, password, who, name})
        });
        if(response.status === 201) {
            document.getElementById("signup_server_response").innerText = "Success!";
        }
    }

    render() {
        return (
            <div>
                <h3>Login</h3>
                <input placeholder="email" id="login_email"></input>
                <input placeholder="password" type="password" id="login_password"></input>
                <p id="login_server_response"></p>
                <button id="submit" onClick={this.login}>login</button>

                <br></br>
                <br></br>

                <h3>Signup</h3>
                <input placeholder="name" id="name"></input>
                <label>Manager</label>
                <input id="who" name="who" type="radio" value={0}></input>
                <label>Worker</label>
                <input id="who" name="who" type="radio" value={1}></input>
                <input placeholder="email" id="signup_email"></input>
                <input placeholder="password" type="password" id="signup_password"></input>
                <p id="signup_server_response"></p>
                <button id="submit" onClick={this.signup}>signup</button>
            </div>
        );
    }
};

export default Auth;