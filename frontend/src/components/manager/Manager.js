import React from 'react';

const commonHeaders  =  { 'Content-Type': 'application/json' }

function getSolution(str) {
    if(str === undefined || str === null) {
        return "pending";
    }
    return str;
}

class Manager extends React.Component {
    constructor(props) {
        super(props);
        this.getWorkers = this.getWorkers.bind(this);
        this.assignTask = this.assignTask.bind(this);
        this.editTask = this.editTask.bind(this);
        this.filter = this.filter.bind(this);
        this.rateTask = this.rateTask.bind(this);
        this.state = {
            workers: [],
            tasks: [],
            filteredTasks: []
        }
    }

    async editTask() {
        let worker_email = document.getElementById("edit_worker_email").value;
        let problem = document.getElementById("edit_problem").value;
        let date = document.getElementById("edit_date").value;
        let index = parseInt(document.getElementById("edit_index").value);
        date = new Date(date);

        let upObject = this.state.tasks[index];
        upObject.to = worker_email;
        upObject.problem = problem;
        upObject.deadline = date;

        upObject = JSON.stringify(upObject);

        let response = await fetch('http://localhost:4000/manager/task', {
            method: 'PUT',
            headers: commonHeaders,
            body: {
                upObject
            }
        });
    }

    async rateTask() {
        let index = parseInt(document.getElementById("rate_index").value);
        let points = parseInt(document.getElementById("rate_point").value);
        
        let objectToSend = this.state.tasks[index];
        objectToSend.points = points;

        objectToSend = JSON.stringify(objectToSend);

        await fetch('/manager/task', {
            method: "PUT",
            headers: commonHeaders,
            body: objectToSend
        });
    }

    filter() {
        let start = document.getElementById("filter_start").value;
        let end   = document.getElementById("filter_end").value;
        console.log({start, end});
        let filterTasks = [];

        for(let i = 0; i < this.state.tasks.length; ++i) {
            let jsdate = new Date(this.state.tasks[i].deadline);
            let yy = jsdate.getUTCFullYear().toString();
            let mm = jsdate.getUTCMonth().toString();
            mm = parseInt(mm);
            mm += 1;
            mm = mm.toString();
            let dd = jsdate.getUTCDate().toString();
            if(mm.length < 2) { mm = "0" + mm; }
            if(dd.length < 2) { dd = "0" + dd; }
            jsdate = yy + "-" + mm + "-" + dd;
            console.log({jsdate})
            if(jsdate <= end && jsdate >= start) {
                filterTasks.push(this.state.tasks[i]);
            }
        }

        this.setState({filteredTasks: filterTasks});
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
        document.querySelectorAll('.edit_forms').forEach(function(child) {
            child.style.display = "none";
        })
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

                <h3>Your workers</h3>
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

                <h3>Tasks given by you</h3>
                {this.state.tasks.map((datum, index) => (
                    // status: (0/1/2) (assign/pending/done)
                    <div>
                        <hr></hr>
                        <p key={index}>Task index: {index}</p>
                        <p key={index}>Assigned To: {datum.to}</p>
                        <p key={index}>Deadline: {datum.deadline}</p>
                        <p key={index}>Problem statement: {datum.problem}</p>
                        <p key={index}>Status: {datum.status}</p> 
                        <p key={index}>Solution: {getSolution(datum.solution)}</p>
                        <p key={index}>Points: {datum.points}</p>
                        <hr></hr>
                    </div>
                ))}

                <h3>Filter tasks</h3>
                <label>Start: </label>
                <input type="date" id="filter_start"></input>
                <label>End: </label>
                <input type="date" id="filter_end"></input>
                <button type="submit" onClick={this.filter}>filter</button>
                {this.state.filteredTasks.map((datum, index) => (
                    // status: (0/1/2) (assign/pending/done)
                    <div>
                        <hr></hr>
                        <p key={index}>Task index: {index}</p>
                        <p key={index}>Assigned To: {datum.to}</p>
                        <p key={index}>Deadline: {datum.deadline}</p>
                        <p key={index}>Problem statement: {datum.problem}</p>
                        <p key={index}>Status: {datum.status}</p> 
                        <p key={index}>Solution: {datum.solution}</p>
                        <p key={index}>Points: {datum.points}</p>
                        <hr></hr>
                    </div>
                ))}


                <h3>Edit tasks</h3>
                <label>Task index</label>
                <input id="edit_index" type="number"></input>
                <label>Deadline</label>
                <input type="date" id="edit_date"></input>
                <label>Problem statement</label>
                <textarea id="edit_problem"></textarea>
                <input placeholder="email of worker" id="edit_worker_email"></input>
                <button type="submit" onClick={this.editTask}>edit</button>


                <h3>Rate tasks</h3>
                <label>Task index</label>
                <input id="rate_index" type="number"></input>
                <label>Points</label>
                <input id="rate_point" type="number"></input>
                <button type="submit" onClick={this.rateTask}>rate</button>
            </div>
        );
    }
};

export default Manager;