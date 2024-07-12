import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import Signup from "./components/pages/Signup";
import Login from "./components/pages/Login";
import Welcome from "./components/pages/Welcome";
import UpdateProfile from "./components/pages/UpdateProfile";
import ForgotPassword from "./components/pages/ForgotPassword";
import ExpensePage from "./components/pages/ExpensePage";
import Header from "./components/header/Header";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Add loading state

  useEffect(() => {
    const authToken = localStorage.getItem('authToken');
    if (authToken) {
      setIsLoggedIn(true);
    }
    setIsLoading(false); // Set loading to false once the check is done
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setIsLoggedIn(false);
  };

  if (isLoading) {
    return <div>Loading...</div>; 
  }

  return (
    <Router>
      <Header isLoggedIn={isLoggedIn} handleLogout={handleLogout} />
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
