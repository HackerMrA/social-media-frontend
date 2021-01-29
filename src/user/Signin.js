import React, { Component } from 'react';

import { Redirect ,Link} from 'react-router-dom';

import { signin, authenticate } from '../auth';

class Signin extends Component {

    state = {
        email: "",
        password: "",
        error: "",
        redirectToReferer: false,
        loading: false
    };

    handleChange = (name) => (event) => {
        this.setState({ error: "" })
        this.setState({ [name]: event.target.value })
    }






    clickSubmit = event => {
        event.preventDefault();
        this.setState({ loading: true });
        const { email, password } = this.state;
        const user = {
            email,
            password
        };
        signin(user)
            .then(data => {
                console.log(data);
                if (data.error) {
                    this.setState({ loading: false });
                    this.setState({ error: data.error });
                }

                else {
                    //authenticate
                    authenticate(data, () => {
                        this.setState({ redirectToReferer: true })
                    })
                }
            })

    };



    render() {

        if (this.state.redirectToReferer) {
            return <Redirect to="/" />
        }
        return (
            <div className="container">
                <h2 className="mt-5 mb-5">SignIn</h2>
                <div className="alert alert-warning" style={{ display: this.state.error ? "" : "none" }}>
                    {this.state.error}
                </div>
                {this.state.loading ? (<div className="jumbotron text-center">Loading...</div>) : null}
                <form>
                    <div className="form-group">
                        <label className="text-muted">Email</label>
                        <input onChange={this.handleChange("email")} type="email" className="form-control" value={this.state.email}></input>
                    </div>
                    <div className="form-group">
                        <label className="text-muted">Password</label>
                        <input onChange={this.handleChange("password")} type="password" className="form-control" value={this.state.password}></input>
                    </div>
                    <button onClick={this.clickSubmit} className="btn btn-raised btn-primary">Submit</button>
                </form>
                <p>
                    <Link to="/forgot-password" className="text-danger">
                        {" "}
       Forgot Password
   </Link>
                </p>
            </div>

        )
    };
}


export default Signin;