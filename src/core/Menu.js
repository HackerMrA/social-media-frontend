import React from 'react';

import { Link, withRouter } from 'react-router-dom';

import { signout, isAuthenticated } from '../auth';


const isActive = (history, path) => {
    let c = "nav-link";
    if (history.location.pathname === path)
        c = `${c} active`;
    return c;
}








const Menu = ({ history }) => {
    return (
        <ul className="nav nav-tabs bg-dark">
            <li className="nav-item">
                <Link to="/" className={isActive(history, '/')}>Home</Link>
            </li>
            <li className="nav-item">
                <Link to="/users" className={isActive(history, '/users')}>Users</Link>
            </li>
            <li className="nav-item">
                <Link to="/post/create" className={isActive(history, '/post/create')} >Create Post</Link>
            </li>

            {!isAuthenticated() && (
                <>

                    <li className="nav-item">
                        <Link to="/signin" className={isActive(history, '/signin')} >Sign In</Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/signup" className={isActive(history, '/signup')} >Sign Up</Link>
                    </li>
                </>
            )}



            {isAuthenticated() && (
                <>


                    <li className="nav-item">
                        <Link to="/findpeople" className={isActive(history, '/findpeople')} >Find people</Link>
                    </li>



                    <li className="nav-item">
                        <Link
                            className="nav-link" to={`/user/${isAuthenticated().user._id}`}
                        >{`${isAuthenticated().user.name}`}</Link>
                    </li>
                    <li className="nav-item">
                        <Link
                            className="nav-link"
                            onClick={() => signout(() => {
                                history.push('/')
                            })}
                        >Sign out</Link>
                    </li>

                </>
            )}

            



        </ul>
    )
}


export default withRouter(Menu);
