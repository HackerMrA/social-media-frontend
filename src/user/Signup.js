import React,{Component} from 'react';

import {signup} from '../auth';

import {Link} from 'react-router-dom';

class Signup extends Component{

    state={
        name:"",
        email:"",
        password:"",
        error:"",
        open:false
    }

    handleChange=(name)=>(event)=>{
        this.setState({error:""})
        this.setState({[name]:event.target.value})
    }
    

    

    clickSubmit=event=>{
        event.preventDefault();
        const{name,email,password}=this.state;
        const user={
            name,
            email,
            password
        };
        signup(user)
        .then(data=>{
            if(data.error)
                this.setState({error:data.error});
            else    
                this.setState({
                    name:"",
                    email:"",
                    password:"",
                    error:"",
                    open:true
                })
        })

        };



    render(){
        return(
        <div className="container">
            <h2 className="mt-5 mb-5">SignUp</h2>
            <div className="alert alert-warning" style={{display:this.state.error? "":"none"}}>
                {this.state.error}
            </div>
            <div className="alert alert-info" style={{display:this.state.open? "":"none"}}>
                New Account is suuccessfully created!  Please <Link to="/signin">Sign In</Link>
            </div>
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
                    <label className="text-muted">Password</label>
                    <input onChange={this.handleChange("password")} type="password" className="form-control"value={this.state.password}></input>
                </div>
                <button onClick={this.clickSubmit} className="btn btn-raised btn-primary">Submit</button>
            </form>
        </div>
        )
    };
}


export default Signup;