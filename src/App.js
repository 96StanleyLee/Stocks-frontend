import React, { useEffect } from "react";
import "./App.css";
import Menu from "./container/Menu";
import Main from "./container/Main";
import Login from "./container/Login";
import Portfolio from "./container/Portfolio";
import axios from "axios";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Cookies from "js-cookie";

function App() {
  const [stock, setStock] = React.useState("");
  const [user, setUser] = React.useState({});
  const [userfield, setUserfield] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [portfolio, setPortfolio] = React.useState({});

  const submit = async () => {
    let data = { email: userfield, password: password };
    let response = await axios.post("http://localhost:4000/login", data);
    if (response.data) {
      setUser(response.data.user);
      Cookies.set("token", response.data.token, { expires: 7 });
      console.log(Cookies.get("token"));
    }
  };

  const logout = async () => {
    let token = Cookies.get("token");
    Cookies.remove("token");
    let response = await axios.post("http://localhost:4000/logout", { token });
    setUser({});
  };

  useEffect(() => {
    const autoLogin = async () => {
      let token = Cookies.get("token");
      let data = { token };
      let response;
      if (token) {
        response = await axios.post("http://localhost:4000/autologin", data);
        setUser(response.data);
      }
    };
    autoLogin();
  }, []);

  useEffect(() => {
    const fetchPortfolio = async () => {
      let _id = user._id;
      let response = await axios.get(`http://localhost:4000/portfolio/${_id}`);

      setPortfolio(response.data);
    };

    if (user) {
      fetchPortfolio();
    }
  }, [user]);

  const register = async () => {
    let body = { email: userfield, password: password };
    let response = await axios.post("http://localhost:4000/register", body);
    let data = response.body;
  };

  const addToPortfolio = async (stock) => {
    let response = await axios.post("http://localhost:4000/portfolio", {
      stock,
      user,
    });

    console.log(response);
    let x = [...portfolio];
    x.push(response.data);
    console.log(x);
    setPortfolio(x);
  };

  const removeFromPortfolio = async (stocks) => {
    let tester = { user, stocks };
    let response = await axios.delete("http://localhost:4000/delete", {
      data: tester,
    });
    let x = [...portfolio];

    x = x.filter((stock) => {
      return stock.ticker !== stocks;
    });

    setPortfolio(x);

    console.log(x);
  };

  return (
    <div className="App">
      <Router>
        <Route
          path="/"
          render={(routeProps) => (
            <Menu
              {...routeProps}
              logout={logout}
              user={user}
              setStock={setStock}
            />
          )}
        />
        <Route
          exact
          path="/"
          render={(routeProps) => (
            <Main
              stock="GOOGL"
              user={user}
              remove={removeFromPortfolio}
              add={addToPortfolio}
              currentPortfolio={portfolio}
            />
          )}
        />
        <Route
          exact
          path="/stocks/:id"
          render={(routeProps) => (
            <Main
              {...routeProps}
              stock={stock}
              remove={removeFromPortfolio}
              add={addToPortfolio}
              user={user}
              currentPortfolio={portfolio}
            />
          )}
        />
        <Route
          exact
          path="/login"
          render={(routeProps) => (
            <Login
              {...routeProps}
              users={user}
              submit={submit}
              user={setUserfield}
              password={setPassword}
            />
          )}
        />
        <Route
          exact
          path="/register"
          render={(routeProps) => (
            <Login
              {...routeProps}
              users={user}
              submit={register}
              user={setUserfield}
              password={setPassword}
            />
          )}
        />
        <Route
          exact
          path="/portfolio"
          render={(routeProps) => (
            <Portfolio {...routeProps} users={user} portfolio={portfolio} />
          )}
        />
      </Router>
    </div>
  );
}

export default App;
