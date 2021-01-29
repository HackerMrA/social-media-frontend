import React,{Component} from 'react';
import {Link} from 'react-router-dom';

import {list} from './apiuser';

import defaultProfile from '../images/avatar.jpeg';

class Users extends Component{
    state={
        users:[]
    }

    componentDidMount(){
        list()
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
                        </div>
                      </div>
                    ))}
                </div>
    );

    render(){
        const {users}=this.state;

        return(
            <div>
                <h2 className="mt-5 mb-5">Users</h2>
                    {this.renderUsers(users)}
            </div>
        )
    }
}



export default Users;