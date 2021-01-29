import React, { Component } from 'react';
import {remove} from './apiuser';
import {signout} from '../auth/index';
import {isAuthenticated} from '../auth';
import { Redirect } from 'react-router-dom';

class Deleteuser extends Component {

    state={
        redirect:false
    }


    deleteAccount = () => {
        const token=isAuthenticated().token;
        const userId=this.props.userId;
        remove(userId,token)
        .then(data=>{
            if(data.error){
                console.log(data.error);
            }
            else{
                //signout
                signout(()=>{
                    console.log('user deleted');
                })
                //redirect
                this.setState({redirect:true})
            }
        })
    }

    deleteConfirmed = () => {
        let answer = window.confirm("Are you sure to delete your account?");
        if (answer) {
            this.deleteAccount();
        }
    }

    render() {
        if(this.state.redirect){
            return <Redirect to={'/'} />
        }
        return (
            <button onClick={this.deleteConfirmed} className="btn btn-raised btn-danger">Delete Profile</button>
        );
    }
}

export default Deleteuser;