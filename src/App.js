import React from "react";
import {BrowserRouter as Router, Route,Switch} from "react-router-dom";
import Signup from "./components/pages/Signup";
import Login from "./components/pages/Login";
import Welcome from "./components/pages/Welcome";
import UpdateProfile from "./components/pages/UpdateProfile";
function App() {
  return(
    <Router>
     <Switch>
    <Route path="/signup">   
    <Signup />
    </Route>
    <Route path="/welcome" >
    <Welcome />
    </Route>
    <Route path="/update-profile" >
    <UpdateProfile />
    </Route>
    <Route  path="/" >
    <Login />
    </Route>
    </Switch>
    </Router>
  )
}

export default App;
