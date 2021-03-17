import React from 'react';
import Auth from './auth/Auth';
import Manager from './manager/Manager';
import Worker from './worker/Worker';

const commonHeaders  =  { 'Content-Type': 'application/json' }

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            _id: -1,
            isAuthenticated: false,
            who: -1,
            email: 'nothing',
            name: 'nothing'
        }
    }

    componentDidMount() {
        if(localStorage.getItem("token") !== null) {
            let token = localStorage.getItem("token");
            fetch('/verifyToken', {
                method: 'POST',
                headers: commonHeaders,
                body: JSON.stringify({token})
            }).then((res) => res.json())
            .then((data) => {
                console.log(data);
                this.setState({ 
                    isAuthenticated: true, 
                    _id: data.decoded._id, 
                    who: data.decoded.who, 
                    email: data.decoded.email, 
                    name: data.decoded.name
                });
            });
        }
    }

    render() {
        if(this.state.isAuthenticated) {
            if(this.state.who === 0) {
                return (<Manager email={this.state.email}/>);
            }
            else {
                return (<Worker email={this.state.email} _id={this.state._id}/>);
            }
        }
        else {
            return (<Auth/>);
        }
    }
};

export default App;