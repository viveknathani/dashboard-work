import React from 'react';

function getSolution(str) {
    if(str === undefined || str === null) {
        return "pending";
    }
    return str;
}

const commonHeaders  =  { 'Content-Type': 'application/json' }

class Worker extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tasks: [],
            completed: [],
            searchResults: []
        }
        this.submitTask = this.submitTask.bind(this);
        this.search = this.search.bind(this);
        this.submitProfile = this.submitProfile.bind(this);
    }

    async submitTask() {
        let index = parseInt(document.getElementById("submit_index").value);
        let solution = parseInt(document.getElementById("submit_solution").value);

        await fetch(`/worker/submit`, {
            method: 'PUT',
            headers: commonHeaders,
            body: JSON.stringify({
                _id: this.state.tasks[index],
                solution: solution
            })
        });
        window.location.reload();
    }

    async submitProfile() {
        let name = document.getElementById("name").value;

        await fetch(`/worker/submit`, {
            method: 'PUT',
            headers: commonHeaders,
            body: JSON.stringify({
                _id: this.props._id,
                name: name
            })
        });
        window.location.reload();
    }

    search() {
        let searchTerm = document.getElementById("search").value;
        let res = [];
        for(let i = 0; i < this.state.tasks.length; ++i) {
            let tofind = this.state.tasks[i].problem;
            if(this.state.tasks[i].problem.includes(searchTerm)) {
                res.push(this.state.tasks[i]);
            }
        }
        this.setState({searchResults: res});
    }

    async getTasks() {
        fetch(`/worker/tasks/${this.props.email}`, {
            method: 'GET',
            headers: commonHeaders
        }).then((res) => res.json())
        .then((data) => {
            if(data.length !== 0)
            {
               console.log(data);
               let temp = []
                for(let i = 0; i < data.length; ++i) {
                    if(data[i].status === 1) {
                        temp.push(this.state.tasks);
                    }
                }
                console.log(temp);
               this.setState({tasks: data, completed: temp});
            }
        });
    }

    componentDidMount() {
        this.getTasks();
    }

    render() {
        return(
            <div>
                <h1>Worker dashboard</h1>
                <h2>Edit profile</h2>
                <label>name:</label>
                <input type="text" placeholder={this.props.name} id="edit_name"></input>
                <button>submit profile</button>

                <h2>Your tasks</h2>
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

                <h2>Submit task</h2>
                <label>Task index</label>
                <input id="submit_index" type="number"></input>
                <label>Solution</label>
                <textarea id="submit_solution"></textarea>
                <button type="submit" onClick={this.submitTask}>submit task</button>

                <h2>Completed Tasks</h2>
                {this.state.completed.map((datum, index) => (
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

                <h2>Search</h2>
                <input id="search" placeholder="search by problem"></input>
                <button type="submit" onClick={this.search}>search</button>
                {this.state.searchResults.map((datum, index) => (
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

            </div>
        );
    }
};

export default Worker;