import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import firebase from 'firebase/app';
import config from '../config/firebase-config';
import Header from './Header';
import Cooker from './Cooker';
import Top from './Top';

class App extends Component {
  constructor() {
    super();
    // Initialize Firebase
    if(firebase.apps.length === 0) firebase.initializeApp(config);
    this.state = { isAuthed : false };
  }

  onLogin = (isAuthed) => this.setState({ isAuthed });

  render() {
    return (
      <Router>
        <div className="App">
          <Header onLogin={this.onLogin} />
          <Switch>
            <Route exact path="/app" component={Top} />
            <Route path="/app/dashboard" component={Cooker} />
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
