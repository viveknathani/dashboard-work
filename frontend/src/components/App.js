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
            who: -1
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
                this.setState({isAuthenticated: true, id: data.decoded.id});
            });
        }
    }

    render() {
        if(this.state.isAuthenticated) {
            if(this.state.who === 0) {
                return (<Manager/>);
            }
            else {
                return (<Worker/>);
            }
        }
        else {
            return (<Auth/>);
        }
    }
};

export default App;