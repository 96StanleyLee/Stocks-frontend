import React, { useEffect } from 'react';
import './App.css';
import Menu from './container/Menu'
import Main from './container/Main'
import Login from './container/Login'
import Register from './container/Register'
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

    //let data = await response.json()
    if(response.data){
      setUser(response.data.user)
      Cookies.set('token', response.data.token, {expires: 7})
      console.log(Cookies.get('token'))
    }
  }


  const logout = async () =>{
    let token = Cookies.get('token')
    console.log(token)
    // Cookies.remove('token')
    let response = await axios.post('http://localhost:4000/logout', {token})
    console.log(response)
  }

  useEffect(()=>{
    const autoLogin = async()=>{
      let token = Cookies.get('token')
      let data = {token}
      console.log(data)
      let response =  await axios.post('http://localhost:4000/autologin',data)
      setUser(response.data)
    }
    autoLogin()
  },[])


  const register = async () =>{

    let body = {email: userfield, password: password}

    let response = await axios.post('http://localhost:4000/register', body)
    let data =  response.body

    console.log(data)


  }

  


  return (
    <div className="App">
      <Router>
        <Route path="/" render={ routeProps => <Menu {...routeProps} logout={logout} user={user} setStock={setStock}/>}/>
        <Route exact path="/" render={routeProps => <Main stock="GOOGL"/>}/>
        <Route exact path="/stocks/:id" render={ routeProps => <Main {...routeProps} stock={stock}/>}/>
        <Route exact path="/login" render={() =><Login users={user} submit={submit} user={setUserfield} password={setPassword} />}/>
        <Route exact path="/register" render={() =><Login users={user} submit={register} user={setUserfield} password={setPassword} />}/>

      </Router>
      
    </div>
  );
}

export default App;
