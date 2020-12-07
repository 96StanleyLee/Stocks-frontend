import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      margin: theme.spacing(1),
      width: "25ch",
    },
  },
}));

const Login = (props) => {
  const classes = useStyles();
  console.log(props);
  return (
    <form className={classes.root} id="form" noValidate autoComplete="off">
      <h1 style={{ margin: "auto" }}>
        {props.match.path === "/register" ? "Register" : "Login"}
      </h1>
      <>
        {Object.keys(props.users).length !== 0 ? <Redirect to="/" /> : null}
        <div className="login_form">
          <div className="inputs">
            <TextField
              onChange={(e) => props.user(e.target.value)}
              id="standard-basic"
              label="Email"
            />
            <TextField
              onChange={(e) => props.password(e.target.value)}
              id="standard-basic"
              label="Password"
            />
          </div>
          <div className="button">
            <Button onClick={props.submit}>Submit</Button>
          </div>
        </div>
      </>
    </form>
  );
};

export default Login;
