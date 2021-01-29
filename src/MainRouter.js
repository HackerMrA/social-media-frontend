import React from 'react';
import { Route, Switch } from 'react-router-dom';

import Home from './core/Home';
import Menu from './core/Menu';
import Signup from './user/Signup';
import Signin from './user/Signin';
import Profile from './user/Profile';
import Users from './user/Users';
import EditProfile from './user/EditProfile';
import Findpeople from './user/Findpeople';
import PrivateRoute from './auth/PrivateRoute';
import NewPost from './post/newPost';
import SinglePost from './post/SinglePost';
import EditPost from './post/EditPost';
import ForgotPassword from "./user/ForgotPassword";
import ResetPassword from "./user/ResetPassword";





const MainRouter = () => (
    <div>
        <Menu />
        <Switch>
            <Route exact path="/forgot-password" component={ForgotPassword} />
            <Route
                exact
                path="/reset-password/:resetPasswordToken"
                component={ResetPassword}
            />
            <Route path='/' exact component={Home} />
            <Route path='/users' exact component={Users} />
            <Route path='/users' exact component={Users} />
            <Route path='/signup' exact component={Signup} />
            <Route path='/signin' exact component={Signin} />
            <PrivateRoute path="/post/create" exact component={NewPost} />
            <PrivateRoute path="/post/:postId" exact component={SinglePost} />
            <PrivateRoute path='/post/edit/:postId' exact component={EditPost} />
            <PrivateRoute path='/user/edit/:userId' exact component={EditProfile} />
            <PrivateRoute path='/user/:userId' exact component={Profile} />
            <PrivateRoute path="/findpeople" exact component={Findpeople} />



        </Switch>
    </div>
)

export default MainRouter;