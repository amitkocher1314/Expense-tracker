import React, { useState } from "react";
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import Signup from "./components/pages/Signup";
import Login from "./components/pages/Login";
import Welcome from "./components/pages/Welcome";
import UpdateProfile from "./components/pages/UpdateProfile";
import ForgotPassword from "./components/pages/ForgotPassword";
import ExpensePage from "./components/pages/ExpensePage";
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('authToken'));

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

 

  return (
    <Router>
      
      <Switch>
        <Route path="/signup">
          <Signup />
        </Route>
        <Route path="/welcome">
          {isLoggedIn ? <Welcome /> : <Redirect to="/" />}
        </Route>
        <Route path="/forgot-password">
          <ForgotPassword />
        </Route>
        <Route path="/expenses">
          {isLoggedIn ? <ExpensePage /> : <Redirect to="/" />}
        </Route>
        <Route path="/update-profile">
          {isLoggedIn ? <UpdateProfile /> : <Redirect to="/" />}
        </Route>
        <Route path="/">
          <Login onLogin={handleLogin} />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
