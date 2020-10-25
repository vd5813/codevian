import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'

export default class Logout extends Component {
    constructor() {
        super()
        // token remove
        localStorage.removeItem("token")
    }


    render() {
        return <Redirect to="/" />
    }
}
