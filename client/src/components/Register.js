import React, { Component } from 'react';
import {
    FormBuilder,
    FieldGroup,
    FieldControl,
    Validators,
} from "react-reactive-form";
import Axios from 'axios';
import { Redirect } from 'react-router-dom'

const TextInput = ({ handler, touched, hasError, meta }) => (
    <div>
        <input placeholder={`Enter ${meta.label}`} {...handler()} />
        <span>
            {touched
                && hasError("required")
                && `${meta.label} is required`}
        </span>
    </div>
)
export default class Register extends Component {
    constructor(props) {
        super(props)
        let reg = false
        this.state = {
            name: '',
            email: '',
            password: '',
            phone: '',
            address: '',
            reg,
            error: ""
        }
    }
    loginForm = FormBuilder.group({
        email: ["", Validators.required],
        password: ["", Validators.required],
        rememberMe: false
    });
    handleReset = () => {
        this.loginForm.reset();
    }
    handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Form values", this.loginForm.value);
        const { name, email, password, address, phone } = this.loginForm.value
        try {
            const token = await Axios.post("http://localhost:5000/register", { name, email, password, address, phone })
            localStorage.setItem("token", token.data.token)
            console.log(token.data.token)
            this.setState({
                reg: true
            })
        } catch (err) {
            this.setState({
                error: err.message
            })
        }
    }
    render() {
        if (this.state.reg === true) {
            return <Redirect to="/" />
        }
        return (
            <FieldGroup
                control={this.loginForm}
                render={({ get, invalid }) => (
                    <form onSubmit={this.handleSubmit}>

                        <FieldControl
                            name="email"
                            render={TextInput}
                            meta={{ label: "email" }}
                        />

                        <FieldControl
                            name="password"
                            render={TextInput}
                            meta={{ label: "Password" }}
                        />
                        <FieldControl
                            name="name"
                            render={TextInput}
                            meta={{ label: "name" }}
                        />

                        <FieldControl
                            name="phone"
                            render={TextInput}
                            meta={{ label: "phone" }}
                        />

                        <FieldControl
                            name="address"
                            render={TextInput}
                            meta={{ label: "address" }}
                        />

                        <FieldControl
                            name="rememberMe"
                            render={({ handler }) => (
                                <div>
                                    <input {...handler("checkbox")} />
                                </div>
                            )}
                        />
                        <button
                            type="button"
                            onClick={this.handleReset}
                        >
                            Reset
                    </button>
                        <button
                            type="submit"
                            disabled={invalid}
                        >
                            Submit
                    </button>
                    </form>
                )}
            />
        );
    }
}
