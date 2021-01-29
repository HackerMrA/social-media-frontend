import React, { Component } from 'react';
import { isAuthenticated } from '../auth';

import { create } from './apipost';
import { Redirect } from 'react-router-dom';

class NewPost extends Component {
    state = {
        title: '',
        body: '',
        photo: '',
        error: '',
        user: {},
        loading: false,
        fileSize: 0,
        redirectToProfile: false
    }

    handleChange = (name) => (event) => {
        this.setState({ error: "" })
        const value = name === 'photo' ? event.target.files[0] : event.target.value;
        const fileSize = name === 'photo' ? event.target.files[0].size : 0;
        this.postData.set(name, value);
        this.setState({ [name]: value, fileSize })
    }


    isValid = () => {
        const { title, body, fileSize } = this.state;
        if (title.length === 0) {
            this.setState({ error: "Title is required" })
            return false;
        }
        if (fileSize > 10000000) {
            this.setState({ error: "file size should be less than 10 MB" })
            return false;
        }
        return true;
    }




    clickSubmit = event => {
        event.preventDefault();
        this.setState({ loading: true })
        if (this.isValid()) {
            const userId = isAuthenticated().user._id;
            const token = isAuthenticated().token;
            create(userId, token, this.postData)
                .then(data => {
                    if (data.error)
                        this.setState({ error: data.error });
                    else {
                        console.log(data);
                        this.setState({ loading: false, title: '', body: '', photo: '', redirectToProfile: true });
                    }

                })
        }
    };



    componentDidMount() {
        this.postData = new FormData();
        this.setState({ user: isAuthenticated().user })

    }


    render() {

        if (this.state.redirectToProfile) {
            return <Redirect to={'/'} />
        }


        return (
            <div className="container">
                <h2 className="mt-5 mb-5">Create New Post</h2>
                <div className="alert alert-warning" style={{ display: this.state.error ? "" : "none" }}>
                    {this.state.error}
                </div>
                {this.state.loading ? (<div className="jumbotron text-center">Loading...</div>) : null}

                <form>
                    <div className="form-group">
                        <label className="text-muted">Profile Picture</label>
                        <input type="file" accept="image/*" className="form-control" onChange={this.handleChange("photo")} ></input>
                    </div>
                    <div className="form-group">
                        <label className="text-muted">Title</label>
                        <input type="text" className="form-control" onChange={this.handleChange("title")} value={this.state.title}></input>
                    </div>

                    <div className="form-group">
                        <label className="text-muted">Body</label>
                        <textarea type="text" className="form-control" onChange={this.handleChange("body")} value={this.state.body} />
                    </div>

                    <button onClick={this.clickSubmit} className="btn btn-raised btn-primary">Create Post</button>
                </form>
            </div>
        );
    }
}

export default NewPost;