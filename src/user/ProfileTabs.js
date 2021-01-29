import React, { Component, useReducer } from 'react';
import defaultProfile from '../images/avatar.jpeg';
import { Link } from 'react-router-dom';
class ProfileTabs extends Component {
    state = {}
    render() {
        const { following, followers, posts } = this.props;
        return (
            <div className="row">
                <div className="col-md-4">
                    <h3 className="text-primary">Followers</h3>
                    <hr />
                    {
                        followers.map((person, i) => {
                            return (
                                <div key={i}>

                                    <div>
                                        <Link to={`/user/${person._id}`}>
                                            <img
                                                style={{ borderRadius: "50%", border: "1px solid black" }}
                                                className="float-left mr-2"
                                                height="30px"
                                                width="30px"
                                                src={`${process.env.REACT_APP_API_URL}/user/photo/${person._id}`}
                                                alt={person.name}
                                                onError={i => (i.target.src = `${defaultProfile}`)}
                                            />
                                            <p className="lead">{person.name}</p>
                                        </Link>


                                    </div>
                                </div>)
                        })
                    }
                </div>
                <div className="col-md-4">
                    <h3 className="text-primary">Following</h3>
                    <hr />
                    {
                        following.map((person, i) => {
                            return (
                                <div key={i}>

                                    <div>
                                        <Link to={`/user/${person._id}`}>
                                            <img
                                                style={{ borderRadius: "50%", border: "1px solid black" }}
                                                className="float-left mr-2"
                                                height="30px"
                                                width="30px"
                                                src={`${process.env.REACT_APP_API_URL}/user/photo/${person._id}`}
                                                alt={person.name}
                                                onError={i => (i.target.src = `${defaultProfile}`)}
                                            />
                                            <p className="lead">{person.name}</p>
                                        </Link>

                                    </div>
                                </div>)
                        })
                    }
                </div>
                <div className="col-md-4">
                    <h3 className="text-primary">Posts</h3>
                    <hr />
                    {
                        posts.map((post, i) => {
                            return (
                                <div key={i}>

                                    <div>
                                        <Link to={`/post/${post._id}`}>
                                            
                                            <p className="lead">{post.title}</p>
                                        </Link>

                                    </div>
                                    
                                </div>
                                )
                        })
                        
                    }
                </div>
            </div>

        );
    }
}

export default ProfileTabs;