import React, { Component } from 'react';
import { singlePost, update } from './apipost';
import { isAuthenticated } from '../auth';
import { Redirect } from 'react-router-dom';
import defaultPost from '../images/defaultPost.jpg';

class EditPost extends Component {
    state = {
        id: '',
        title: '',
        body: '',
        redirectToPost: false,
        error: '',
        fileSize: 0,
        loading: false,
        photo: ''
    }

    init = (postId) => {

        singlePost(postId)
            .then(data => {
                if (data.error) {
                    this.setState({ redirectToPost: true });
                }
                else {
                    this.setState({ id: data._id, title: data.title, error: "", body: data.body });
                }


            })
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
            const postId = this.props.match.params.postId;
            const token = isAuthenticated().token;
            update(postId, token, this.postData)
                .then(data => {
                    if (data.error)
                        this.setState({ error: data.error });
                    else {
                        console.log(data);
                        this.setState({  title: '', body: '', photo: '', redirectToPost: true });
                    }

                })
        }
        this.setState({loading: false})
    };




    componentDidMount() {
        this.postData = new FormData();

        const postId = this.props.match.params.postId;
        this.init(postId);

    }



    editPostForm = (title, body) => {
        return (
            <form>
                <div className="form-group">
                    <label className="text-muted">Post photo</label>
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

                <button onClick={this.clickSubmit} className="btn btn-raised btn-primary">Update Post</button>
            </form>
        )
    }



    render() {


        const { title, body, redirectToPost } = this.state;

        if (redirectToPost) {
            return (<Redirect to={`/post/${this.props.match.params.postId}`} />)
        }

        return (
            <div className="container">
                <div className="alert alert-warning" style={{ display: this.state.error ? "" : "none" }}>
                    {this.state.error}
                </div>
                {this.state.loading ? (<div className="jumbotron text-center">Loading...</div>) : null}
                <h2 className="mt-5 mb-5">{title}</h2>
                <img style={{ height: "200px", width: "auto" }}
                    className="image-thumbnail"
                    src={`${process.env.REACT_APP_API_URL}/post/photo/${this.state.id}?${new Date().getTime()}`}
                    onError={i => i.target.src = `${defaultPost}`}
                    alt={this.state.name}></img>
                {this.editPostForm(title, body)}
            </div>
        )
    }
}

export default EditPost;