import React, { useEffect } from 'react';
import './App.css';
import Menu from './container/Menu'
import Main from './container/Main'
import Login from './container/Login'
import axios from 'axios';
import {
  BrowserRouter as Router,
  Route
} from "react-router-dom";
import Cookies from 'js-cookie'

function App() {

  const [stock, setStock] = React.useState("")
  const [user, setUser] = React.useState({})
  const[userfield, setUserfield] = React.useState('')
  const[password, setPassword] = React.useState('')

  const submit = async () =>{
    let data = {email: userfield, password: password}
    let response = await axios.post('http://localhost:4000/login',data)
    if(response.data){
      setUser(response.data.user)
      Cookies.set('token', response.data.token)
      console.log(Cookies.get('token'))
    }
  }

  useEffect(()=>{

    const autoLogin = async()=>{
      let token = Cookies.get('token')
      let data = {token}


      let response =  await axios.post('http://localhost:4000/autologin',data)
      setUser(response.data)
    }

    autoLogin()

  },[])


  return (
    <div className="App">
      <Router>
        <Route path="/" render={ routeProps => <Menu {...routeProps} setStock={setStock}/>}/>
        <Route exact path="/" render={routeProps => <Main stock="GOOGL"/>}/>
        <Route exact path="/stocks/:id" render={ routeProps => <Main {...routeProps} stock={stock}/>}/>
        <Route exact path="/login" render={() =><Login users={user} submit={submit} user={setUserfield} password={setPassword} />}/>
      </Router>
      
    </div>
  );
}

export default App;
