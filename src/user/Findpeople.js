import React,{Component} from 'react';
import {Link} from 'react-router-dom';

import {findPeople, follow} from './apiuser';

import {isAuthenticated} from '../auth'

import defaultProfile from '../images/avatar.jpeg';

class Findpeople extends Component{
    state={
        users:[],
        error:'',
        open:false,
        followMessage:""
    }


    clickFollow=(user,i)=>{
        const userId=isAuthenticated().user._id;
        const token=isAuthenticated().token
        follow(userId,token,user._id)
        .then(data=>{
            if(data.error)
                this.setState({error:data.error})
            else{
                let toFollow=this.state.users
                toFollow.splice(i,1)
                this.setState({users:toFollow,
                    open:true,
                    followMessage:`Following ${user.name}`
                })
            }
        })
    }

    componentDidMount(){
        const userId=isAuthenticated().user._id;
        const token=isAuthenticated().token
        findPeople(userId,token)
        .then(data=>{
            if(data.error){
                console.log(data.error);
            }
            else{
                this.setState({users:data});
            }
        });
    }

    renderUsers=(users)=>(
        <div className="row">
                    {users.map((user,i)=>(
                        <div class="card col-md-4"  key={i}>
                        <img style={{width:"auto"}} className="image-thumbnail" src={`${process.env.REACT_APP_API_URL}/user/photo/${user._id}`} alt={user.name}
                        onError={i=>(i.target.src=`${defaultProfile}`)}
                        ></img>
                        <div className="card-body">
                          <h5 className="card-title">{user.name}</h5>
                          <p className="card-text">{user.email}</p>
                          <Link to={`/user/${user._id}`} class="btn btn-raised btn-primary btn-sm">View Profile</Link>
                          <button onClick={()=>this.clickFollow(user,i)} className="btn btn-raised btn-info float-right btn-sm">Follow</button>
                        </div>
                      </div>
                    ))}
                </div>
    );

    render(){
        const {users,open,followMessage}=this.state;

        return(

            <div>
                <h2 className="mt-5 mb-5">Find People</h2>
                <div >
        {open && (<p className="alert alert-success">{followMessage}</p>)}
                </div>
                    {this.renderUsers(users)}
            </div>
        )
    }
}



export default Findpeople;