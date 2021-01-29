import React, { Component } from 'react';
import defaultPost from '../images/defaultPost.jpg';
import { Link, Redirect } from 'react-router-dom';
import { singlePost , remove,like,unlike, comment} from './apipost';
import {isAuthenticated} from '../auth';
import Comment from './Comment';
class SinglePost extends Component {

    state = {
        post: '',
        deleted:false,
        like:false,
        likes:0,
        redirectToSignin:false,
        comments:[]
    }

    checkLike=(likes)=>{
        const userId=isAuthenticated().user._id;
        let match=likes.indexOf(userId) !== -1;
        return match;
    }

    componentDidMount = () => {
        singlePost(this.props.match.params.postId)
            .then(data => {
                if (data.error) {
                    console.log("error");
                }
                else {
                    this.setState({ post: data,likes:data.likes.length,like:this.checkLike(data.likes),comments:data.comments})
                }
            })
    }


    updateComments=comments=>{
        this.setState({comments});
    }


    





    deleteConfirmed = () => {
        let answer = window.confirm("Are you sure to delete your post?");
        if (answer) {
            this.deletePost();
        }
    }

    likeToggle=()=>{

        if(!isAuthenticated()){
            this.setState({redirectToSignin:true});
            return false;
        }

        let callApi=this.state.like ? unlike : like;
        const userId=isAuthenticated() && isAuthenticated().user._id;
        const postId=this.state.post._id;
        const token=isAuthenticated().token;

        callApi(userId,token,postId)
        .then(data=>{
            if(data.error){
                console.log(data.error);
            }
            else{
                this.setState({
                    like: !this.state.like,
                    likes:data.likes.length
                })
            }
        })
        ;
    }




    deletePost=()=>{
        const postId=this.props.match.params.postId;
        const token=isAuthenticated().token;
        remove(postId,token)
        .then(data=>{
            if(data.error){
                console.log(data.error);
            }
            else{
                this.setState({deleted:true});
            }
        })
    }


    renderPost = (post) => {
        const posterId = post.postedBy ? `/user/${post.postedBy._id}` : " ";
        const posterName = post.postedBy ? post.postedBy.name : "Unknown ";

        const {like,likes}= this.state;


        if(this.state.redirectToSignin){
            return <Redirect to={'/signin'} />
        }

        return (
            <div className="card-body">
                <img src={`${process.env.REACT_APP_API_URL}/post/photo/${post._id}`}
                    onError={i => i.target.src = `${defaultPost}`}
                    className="img-thumbnail mb-3"
                    style={{ height: '500px', width: '100%' }}
                    alt={post.title} />
                {like ? (<h3 onClick={this.likeToggle}><i className="fa fa-thumbs-up text-success bg-dark" style={{padding:'10px',borderRadius:'50%'}}></i>{likes} Like</h3>) : <h3 onClick={this.likeToggle}><i className="fa fa-thumbs-up text-warning bg-dark" style={{padding:'10px',borderRadius:'50%'}}></i>{likes} Like</h3>}
                <p className="card-text">{post.body}</p>
                <br />
                <p className="font-italic mark">
                    posted by <Link to={`${posterId}`} >{posterName}</Link>{" "}
                                            on {new Date(post.created).toDateString()}
                </p>
                <div className="d-inline-block">
                    <Link to={`/`} class="btn btn-raised btn-primary btn-sm">Back to Post</Link>
                    {isAuthenticated() && isAuthenticated().user._id === post.postedBy._id ? (
                        <>
                    <Link to={`/post/edit/${post._id}`} class="btn btn-raised btn-success btn-sm ml-5">Update Post</Link>
                    <button  onClick={this.deleteConfirmed} to={`/`}  to={`/`} class="btn btn-raised btn-danger btn-sm ml-5">Delete Post</button></>) : null
                    }
                </div>

            </div>
        )
    }


    render() {
        const { post,deleted, comments } = this.state;
        if(deleted){
            return (<Redirect to={'/'} />)
        }
        return (
            <div className="container">
                <h1 className="display-2 mt-5 mb-5">{post.title}</h1>
                {!post ? (<div className="jumbotron text-center">Loading...</div>) : this.renderPost(post)}
                <Comment postId={post._id} comments={comments} updateComments={this.updateComments} />

            </div>
        );
    }
}

export default SinglePost;