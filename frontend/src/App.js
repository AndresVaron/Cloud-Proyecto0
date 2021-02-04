import React, { useState, useEffect } from "react";
import { Switch, Route, withRouter } from "react-router-dom";
import Login from "./Login/Login.jsx";
import Event from "./Event/Event.jsx";
import Events from "./Events/Events.jsx";
import Create from "./Create/Create.jsx";
import "./App.css";

function App() {
  const [user, setUser] = useState(null);
  useEffect(() => {
    if (localStorage.getItem("correo") !== null) {
      setUser({
        correo: localStorage.getItem("correo"),
        clave: localStorage.getItem("clave"),
      });
    }
  }, []);
  return (
    <Switch>
      <Route
        exact
        path="/"
        render={() => {
          if (user == null) {
            return <Login setUser={setUser} />;
          } else {
            return <Events user={user} />;
          }
        }}
      />
      <Route path="/create/:id" render={() => <Create user={user} />} />
      <Route path="/events/:id" render={() => <Event user={user} />} />
    </Switch>
  );
}

export default withRouter(App);
