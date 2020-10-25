import React from 'react';
import { Route, Switch, Link } from 'react-router-dom'
import Login from './components/Login'
import Logout from './components/Logout'
import User from './components/User'
import Register from './components/Register'

function App() {
  return (
    <div>
      <Switch>
        <Route exact path="/" component={Login} />
        <Route exact path="/logout" component={Logout} />
        <Route exact path="/user" component={User} />
        <Route exact path="/register" component={Register} />
      </Switch>
      <Link to="/register">Register</Link>
    </div>
  );
}

export default App;
