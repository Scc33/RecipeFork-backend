import React from 'react';
import logo from "./resource/recipeFork.png"
import k from "./resource/K.png"
import Login from "./login"
import './App.css';
import CreateAccnt from './createAcct';
import ResetPassword from './resetPassword';
import HomePage from "./homePage"
import UserPage from './userPage';
import RecipePage from './recipePage';

function App() {
  return (
    <div className="App">
      <img src={logo} />
      <h1>RecipeFork</h1>
      
      <CreateAccnt/>

      <img src={k} />

      <header className="App-header">

      </header>
    </div>
  );
}

export default App;

/*<div className="item">
        <Route path="/recipeFork/" exact component={CreateAccnt} />
        <Route path="/recipeFork/login" exact component={Login} />
        <Route path="/recipeFork/forgotPassword" exact component={ResetPassword} />
        <Route path="/recipeFork/home" exact component={HomePage} />
        <Route path="/recipeFork/home" exact component={HomePage} />
        <Route path="/recipeFork/userPage" exact component={UserPage} />
        <Route path="/recipeFork/userPage" exact component={RecipePage} />
      </div>*/
