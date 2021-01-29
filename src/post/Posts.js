import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import defaultPost from '../images/defaultPost.jpg';

import { list } from './apipost';

// import defaultProfile from '../images/avatar.jpeg';

class Posts extends Component {
    state = {
        posts: []
    }

    componentDidMount() {
        list()
            .then(data => {
                if (data.error) {
                    console.log(data.error);
                }
                else {
                    this.setState({ posts: data });
                }
            });
    }

    renderPosts = (posts) => {
        return (
            <div className="row">
                {posts.map((post, i) => {

                    const posterId = post.postedBy ? `/user/${post.postedBy._id}` : " ";
                    const posterName = post.postedBy ? post.postedBy.name : "Unknown ";
                    return (
                        <div class="card col-md-4" key={i}>
                            <div className="card-body">
                                <img src={`${process.env.REACT_APP_API_URL}/post/photo/${post._id}`}
                                    onError={i => i.target.src = `${defaultPost}`}
                                    className="img-thumbnail mb-3"
                                    style={{ height: '200px', width: '100%' }}
                                    alt={post.title} />
                                <h5 className="card-title">{post.title}</h5>
                                <p className="card-text">{post.body.substring(0, 15)}...</p>
                                <br />
                                <p className="font-italic mark">
                                    posted by <Link to={`${posterId}`} >{posterName}</Link>{" "}
                                            on {new Date(post.created).toDateString()}
                                </p>
                                <Link to={`/post/${post._id}`} class="btn btn-raised btn-primary btn-sm">Read More</Link>
                            </div>
                        </div>)

                })}
            </div>
        );
    }

    render() {
        const { posts } = this.state;

        return (
            <div className="container">
                <h2 className="mt-5 mb-5">{!posts.length ? (<div className="jumbotron text-center">Loading...</div>) : this.renderPosts(posts)}</h2>
            </div>
        )
    }
}



export default Posts;