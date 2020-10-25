import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import Axios from 'axios';

export default class User extends Component {
    // initially data is empty in state
    state = { data: [] };

    async componentDidMount() {
        // when component mounted, start a GET request
        // to specified URL
        console.log(localStorage.getItem("token"), 'ttoookkkrnrnn')
        const token = localStorage.getItem("token")
        const data = await Axios.get("http://localhost:5000/allusers", { headers: { "Authorization": `Bearer ${token}` } })
        this.setState({ data: data.data });
        console.log(data.data, 'data')
    }

    render() {
        return (
            <div>
                <style>{`
                    table{
                        border:1px solid black;
                    }
                    td{
                        border:1px solid black;
                    }
                `}</style>
                <h1>User page</h1>
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Phone</th>
                            <th>Email</th>
                            <th>Address</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.state.data.map((user, i) => (
                                <tr key={i}>
                                    <td key={i}>{user.name}</td>
                                    <td key={i}>{user.phone}</td>
                                    <td key={i}>{user.email}</td>
                                    <td key={i}>{user.address}</td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
                <Link to="/logout">Logout</Link>
            </div>
        )
    }
}
