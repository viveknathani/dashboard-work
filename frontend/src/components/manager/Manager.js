import React from 'react';

const commonHeaders  =  { 'Content-Type': 'application/json' }

class Manager extends React.Component {
    constructor(props) {
        super(props);
        this.getWorkers = this.getWorkers.bind(this);
        this.assignTask = this.assignTask.bind(this);
        this.state = {
            workers: [],
            tasks: []
        }
    }

    getWorkers() {
       fetch('/manager/workers', {
            method: 'GET',
            headers: commonHeaders
        }).then((res) => res.json())
        .then((data) => {
            if(data.length !== 0)
            {
               this.setState({workers: data});
            }
        });
    }

    getTasks() {
        fetch(`/manager/tasks/${this.props.email}`, {
            method: 'GET',
            headers: commonHeaders
        }).then((res) => res.json())
        .then((data) => {
            if(data.length !== 0)
            {
                console.log(data);
               this.setState({tasks: data});
            }
        });
    }

    componentDidMount() {
        console.log(this.props.email)
        this.getWorkers();
        this.getTasks();
    }


    async assignTask() {
        let worker_email = document.getElementById("worker_email").value;
        let problem = document.getElementById("problem").value;
        let date = document.getElementById("date").value;
        date = new Date(date);
        let response = await fetch('http://localhost:4000/manager/task', {
            method: 'POST',
            headers: commonHeaders,
            body: JSON.stringify({
                by: this.props.email,
                to: worker_email,
                problem: problem,
                deadline: date
            })
        });
    }

    render() {
        return(
            <div>
                <h1>Manager dashboard</h1>

                <h2>Your workers</h2>
                {this.state.workers.map((datum, index) => (
                                    <p>{datum.name} &nbsp; {datum.email}</p>
                ))}
                
                <h3>Give task</h3>
                <form>
                    <label>Deadline</label>
                    <input type="date" id="date"></input>
                    <label>Problem statement</label>
                    <textarea id="problem"></textarea>
                    <input placeholder="email of worker" id="worker_email"></input>
                    <button id="submit" onClick={this.assignTask}>assign</button>
                </form>

                <h3>Tasks given by you.</h3>
                {this.state.tasks.map((datum, index) => (
                    <p>{datum.to} &nbsp; {datum.problem} &nbsp; {datum.solution} &nbsp; {datum.status}</p>
                ))}
            </div>
        );
    }
};

export default Manager;