import React, { Component } from 'react';
import { isAuthenticated } from '../auth';

import Deleteuser from './Delete';

import { read } from './apiuser';
import defaultProfile from '../images/avatar.jpeg';
import FollowProfileButton from './FollowProfileButton';

import { Redirect, Link } from 'react-router-dom';

import ProfileTabs from './ProfileTabs';

import { listByUser } from '../post/apipost';

class Profile extends Component {

    state = {
        user: { following: [], followers: [] },
        redirectToSignin: false,
        following: false,
        error: "",
        posts: []
    }


    //check follow
    checkFollow = user => {
        const jwt = isAuthenticated();
        const match = user.followers.find(follower => {
            return follower._id === jwt.user._id
        })
        return match;
    }



    clickFollowButton = apiCall => {
        const userId = isAuthenticated().user._id;
        const token = isAuthenticated().token;
        apiCall(userId, token, this.state.user._id)
            .then(data => {
                if (data.error) {
                    this.setState({ error: data.error })
                }
                else {
                    this.setState({ user: data, following: !this.state.following })
                }

            })
    }




    init = (userId) => {
        const token = isAuthenticated().token;
        read(userId, token)
            .then(data => {
                if (data.error) {
                    this.setState({ redirectToSignin: true });
                }
                else {
                    let following = this.checkFollow(data);
                    this.setState({ user: data, following });
                    this.loadPost(data._id)
                }


            })
    }


    loadPost = (userId) => {
        const token = isAuthenticated().token;
        listByUser(userId, token)
            .then(data => {
                if (data.error) {
                    console.log(data.error);
                }
                else {
                    this.setState({ posts: data });
                }
            })
    }

    componentDidMount() {
        const userId = this.props.match.params.userId;
        this.init(userId);

    }

    componentWillReceiveProps(props) {
        const userId = props.match.params.userId;
        this.init(userId);

    }


    render() {
        if (this.state.redirectToSignin)
            return <Redirect to='/signin'></Redirect>
        const photoUrl = this.state.user._id ? `${process.env.REACT_APP_API_URL}/user/photo/${this.state.user._id}?${new Date().getTime()}` : defaultProfile;
        return (
            <div className="container">
                <h2 className="mt-5 mb-5">
                    Profile
                    </h2>
                <div className='row'>
                    <div className="col-md-6">

                        <img style={{ height: "200px", width: "auto" }}
                            className="image-thumbnail" src={photoUrl}
                            alt={this.state.user.name}
                            onError={i => (i.target.src = `${defaultProfile}`)}
                        ></img>

                    </div>
                    <div className="col-md-6">

                        <div className='lead mt-2'>
                            <p>Name: {this.state.user.name}</p>
                            <p>Email: {this.state.user.email}</p>
                            <p>Joined: {new Date(this.state.user.created).toDateString()}</p> </div>
                        {isAuthenticated() && isAuthenticated().user._id === this.state.user._id ? (

                            <div className="d-inline-block mt-5">
                                <Link className="btn btn-raised btn-info mr-5"
                                    to={`/post/create`}
                                >Create Post</Link>
                                <Link className="btn btn-raised btn-success mr-5"
                                    to={`/user/edit/${this.state.user._id}`}
                                >Edit Profile</Link>
                                <Deleteuser userId={this.state.user._id} />
                            </div>

                        ) : (
                                <FollowProfileButton following={this.state.following}
                                    onButtonClick={this.clickFollowButton}
                                />
                            )
                        }



                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12">
                        <hr />
                        <p className="lead">{this.state.user.about}</p>
                        <hr />
                        <ProfileTabs followers={this.state.user.followers}
                            following={this.state.user.following}
                            posts={this.state.posts}
                        />
                    </div>

                </div>
            </div>
        )
    }
}

export default Profile;