import React, { Component } from 'react';

import { comment, uncomment } from './apipost';
import defaultProfile from '../images/avatar.jpeg';

import { isAuthenticated } from '../auth';
import { Link } from 'react-router-dom';

class Comment extends Component {
    state = {
        text: '',
        error: ''
    }


    deleteConfirmed = (comment) => {
        let answer = window.confirm("Are you sure to delete your post?");
        if (answer) {
            this.deleteComment(comment);
        }
    }




    deleteComment = (comment) => {
        const userId = isAuthenticated().user._id;
        const postId = this.props.postId;
        const token = isAuthenticated().token;


        uncomment(userId, token, postId, comment)
            .then(data => {
                if (data.error) {
                    console.log(data.error);
                }
                else {
                    this.setState({ text: '' })
                    this.props.updateComments(data.comments);
                }
            })
    }


    isValid = () => {
        const { text } = this.state;
        if (!text.length > 0 || text.length > 150) {
            this.setState({ error: "Comment should not be empty and less than 150 characters" });
            return false;
        }
        return true;
    }

    handleChange = (event) => {
        this.setState({ text: event.target.value, error: '' })
    }

    addComment = e => {
        e.preventDefault();
        if (this.isValid()) {
            const userId = isAuthenticated().user._id;
            const postId = this.props.postId;
            const token = isAuthenticated().token;


            comment(userId, token, postId, { text: this.state.text })
                .then(data => {
                    if (data.error) {
                        console.log(data.error);
                    }
                    else {
                        this.setState({ text: '' })
                        this.props.updateComments(data.comments);
                    }
                })
        }
    }

    render() {

        const { comments } = this.props;
        comments.reverse();
        const { error } = this.state;
        if (!isAuthenticated()) {
            this.setState({ error: "please signin" });
            return <Link to={'/signin'} />;
        }


        return (
            <div>
                <h2 className="mt-5 mb-5">Leave a Comment </h2>
                <form onSubmit={this.addComment}>
                    <div className="form-group">
                        <input className="form-control" type="text" onChange={this.handleChange} value={this.state.text} placeholder={'Leave a comment'} />
                        <button className="btn btn-raised btn-success mt-3">Add Comment</button>
                    </div>
                </form>
                <div className="alert alert-warning" style={{ display: error ? "" : "none" }}>
                    {error}
                </div>
                <div className="col-md-12">
                    <h3 className="text-primary">{comments.length} Comments</h3>
                    <hr />
                    {
                        comments.map((comment, i) => {
                            return (
                                <div key={i}>

                                    <div>
                                        <Link to={`/user/${comment.postedBy._id}`}>
                                            <img
                                                style={{ borderRadius: "50%", border: "1px solid black" }}
                                                className="float-left mr-2"
                                                height="30px"
                                                width="30px"
                                                src={`${process.env.REACT_APP_API_URL}/user/photo/${comment.postedBy._id}`}
                                                alt={comment.postedBy.name}
                                                onError={i => (i.target.src = `${defaultProfile}`)}
                                            />
                                        </Link>
                                        <p className="lead">{comment.text}</p>
                                        <p className="font-italic mark">
                                            posted by <Link to={`/user/${comment.postedBy._id}`} >{comment.postedBy.name}</Link>{" "}
                                            on {new Date(comment.created).toDateString()}
                                            <span>{isAuthenticated() && isAuthenticated().user._id === comment.postedBy._id ? (
                                                <>

                                                    <button onClick={() => this.deleteConfirmed(comment)} to={`/`} class="btn btn-raised btn-danger btn-sm ml-5">Remove</button></>) : null
                                            }</span>
                                        </p>
                                        <hr />

                                    </div>
                                </div>)
                        })
                    }
                </div>

            </div>
        );
    }
}

export default Comment;