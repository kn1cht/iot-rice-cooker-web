import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import firebase from 'firebase/app';
import config from '../config/firebase-config';
import Header from './Header';
import Cooker from './Cooker';

class App extends Component {
  constructor() {
    super();
    // Initialize Firebase
    if(firebase.apps.length === 0) firebase.initializeApp(config);

  }

  render() {
    return (
      <Router>
        <div className="App">
          <Header />
          <Switch>
            <Route path="/" component={Cooker} />
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
