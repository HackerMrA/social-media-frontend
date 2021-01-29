import React,{Component} from 'react';
import {isAuthenticated} from '../auth';
import defaultProfile from '../images/avatar.jpeg';

import {read,update,updateUser} from './apiuser';
import { Redirect } from 'react-router-dom';

class EditProfile extends Component{
    state={
        id:"",
        name:"",
        email:"",
        password:"",
        redirectToProfile:false,
        error:"",
        loading:false,
        fileSize:0,
        about:""
    }

    handleChange=(name)=>(event)=>{
        this.setState({error:""})
        const value= name==='photo' ? event.target.files[0] : event.target.value;
        const fileSize=name==='photo' ? event.target.files[0].size : 0;
        this.userData.set(name,value);
        this.setState({[name]:value,fileSize})
    }


    isValid=()=>{
        const{name,email,password,fileSize}=this.state;
        if(name.length===0){
            this.setState({error:"name is required"})
            return false;
        }
        if(fileSize>10000000){
            this.setState({error:"file size should be less than 10 MB"})
            return false;
        }
        if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)){
            this.setState({error:"email is not valid"})
            return false;
        }

        if(password.length>0 && password.length<=5){
            this.setState({error:"password must be six characters long"})
            return false;
        }
        return true;
    }
    

    

    clickSubmit=event=>{
        event.preventDefault();
        this.setState({loading:true})
        if(this.isValid()){
        const userId=this.props.match.params.userId;
        const token=isAuthenticated().token;
        update(userId,token,this.userData)
        .then(data=>{
            if(data.error)
                this.setState({error:data.error});
            else{
                updateUser(data,()=>{
                    this.setState({redirectToProfile:true});
                })
                
            }
                
        })
    }
    this.setState({loading:false});
    };


    init=(userId)=>{
        const token=isAuthenticated().token;
        read(userId,token)
        .then(data=>{
            if(data.error){
                this.setState({redirectToProfile:true});
            }
            else   {
                this.setState({id:data._id,name:data.name,email:data.email,error:"",about:data.about});
            }
                 

        })
    }

    componentDidMount(){
        this.userData=new FormData();
        
        const userId=this.props.match.params.userId;
        this.init(userId);
        
    }


    render(){

        if(this.state.redirectToProfile){
            return <Redirect to={`/user/${this.state.id}`}/>
        }

        const photoUrl=this.state.id ? `${process.env.REACT_APP_API_URL}/user/photo/${this.state.id}?${new Date().getTime()}` : defaultProfile;

        return(
            <div className="container">
                <h2 className="mt-5 mb-5">Edit Profile</h2>
                <div className="alert alert-warning" style={{display:this.state.error? "":"none"}}>
                    {this.state.error}
                </div>
                {this.state.loading ? (<div className="jumbotron text-center">Loading...</div>) :null}
                <img style={{height:"200px",width:"auto"}} className="image-thumbnail" src={photoUrl} alt={this.state.name}></img>
                <form>
                <div className="form-group">
                    <label className="text-muted">Profile Picture</label>
                    <input type="file" accept="image/*" className="form-control" onChange={this.handleChange("photo")} ></input>
                </div>
                <div className="form-group">
                    <label className="text-muted">Name</label>
                    <input type="text" className="form-control" onChange={this.handleChange("name")} value={this.state.name}></input>
                </div>
                <div className="form-group">
                    <label className="text-muted">Email</label>
                    <input onChange={this.handleChange("email")} type="email" className="form-control"value={this.state.email}></input>
                </div>
                <div className="form-group">
                    <label className="text-muted">About</label>
                    <textarea type="text" className="form-control" onChange={this.handleChange("about")} value={this.state.about}/>
                </div>
                <div className="form-group">
                    <label className="text-muted">Password</label>
                    <input onChange={this.handleChange("password")} type="password" className="form-control"value={this.state.password}></input>
                </div>
                <button onClick={this.clickSubmit} className="btn btn-raised btn-primary">Update</button>
                </form>
            </div>
        );
    }
}

export default EditProfile;