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
            searchResults: [],
            page: 1
        }
        this.submitTask = this.submitTask.bind(this);
        this.search = this.search.bind(this);
        this.submitProfile = this.submitProfile.bind(this);
    }

    logout() {
        localStorage.clear();
        window.location.reload();
    }

    async submitTask() {
        let index = parseInt(document.getElementById("submit_index").value);
        let solution = document.getElementById("submit_solution").value;

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
        let name = document.getElementById("edit_name").value;

        await fetch(`/worker/profile`, {
            method: 'PUT',
            headers: commonHeaders,
            body: JSON.stringify({
                _id: this.props._id,
                name: name
            })
        });
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

    async getTasks(page, limit) {
        if(page === -1) {
            page = document.getElementById("get_page").value;
        }
        console.log({page, limit});
        fetch(`/worker/tasks/${this.props.email}/${page}/${limit}`, {
            method: 'GET',
            headers: commonHeaders
        }).then((res) => res.json())
        .then((data) => {
            if(data.length !== 0)
            {
               console.log(data);
               let temp = []
                for(let i = 0; i < data.length; ++i) {
                    if(data[i].status === 2) {
                        temp.push(data[i]);
                    }
                }
                console.log(temp);
               this.setState({tasks: data, completed: temp});
            }
        });
    }

    componentDidMount() {
        this.getTasks(1, 25);
    }

    render() {
        return(
            <div>
                <h1>Worker dashboard</h1>
                <button type="submit" onClick={this.logout}>logout</button>
                <h2>Edit profile</h2>
                <label>name:</label>
                <input type="text" placeholder="new name" id="edit_name"></input>
                <button type="submit" onClick={this.submitProfile}>submit profile</button>

                <h2>Your tasks</h2>
                {this.state.tasks.map((datum, index) => (
                    <div>
                        <hr></hr>
                        <p>Task index: {index}</p>
                        <p>Assigned To: {datum.to}</p>
                        <p>Deadline: {datum.deadline}</p>
                        <p>Problem statement: {datum.problem}</p>
                        <p>Status: {datum.status}</p> 
                        <p>Solution: {getSolution(datum.solution)}</p>
                        <p>Points: {datum.points}</p>
                        <hr></hr>
                    </div>
                ))}

                <h2>Completed Tasks</h2>
                {this.state.completed.map((datum, index) => (
                    <div>
                        <hr></hr>
                        <p >Task index: {index}</p>
                        <p>Assigned To: {datum.to}</p>
                        <p>Deadline: {datum.deadline}</p>
                        <p>Problem statement: {datum.problem}</p>
                        <p key={index}>Status: {datum.status}</p> 
                        <p>Solution: {getSolution(datum.solution)}</p>
                        <p>Points: {datum.points}</p>
                        <hr></hr>
                    </div>
                ))}

                <h2>Submit task</h2>
                <label>Task index</label>
                <input id="submit_index" type="number"></input>
                <label>Solution</label>
                <textarea id="submit_solution"></textarea>
                <button type="submit" onClick={this.submitTask}>submit task</button>

                <h2>Search</h2>
                <input id="search" placeholder="search by problem"></input>
                <button type="submit" onClick={this.search}>search</button>
                {this.state.searchResults.map((datum, index) => (
                    <div>
                        <hr></hr>
                        <p>Task index: {index}</p>
                        <p>Assigned To: {datum.to}</p>
                        <p>Deadline: {datum.deadline}</p>
                        <p>Problem statement: {datum.problem}</p>
                        <p key={index}>Status: {datum.status}</p> 
                        <p>Solution: {getSolution(datum.solution)}</p>
                        <p>Points: {datum.points}</p>
                        <hr></hr>
                    </div>
                ))}

            </div>
        );
    }
};

export default Worker;