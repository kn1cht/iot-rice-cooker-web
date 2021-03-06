import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import firebase from 'firebase/app';
import 'firebase/auth';

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  flex: {
    flexGrow: 1,
  },
  button: {
    margin: theme.spacing.unit,
  },
  rightIcon: {
    marginLeft: theme.spacing.unit,
  },
  avatar: {
    height: 25,
    margin: 5,
    width: 25,
    backgroudColor: 'white',
  },
  link: {
    textDecoration: 'none',
    color: 'white',
  },
});

class Header extends Component {
  constructor({onLogin}) {
    super();
    this.onLogin = onLogin;
    this.state = { isAuthed: false, username: '', profilePicUrl: '' }
  }

  componentWillMount() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.setState({ isAuthed: true, username: user.displayName, profilePicUrl: user.photoURL });
      } else {
        this.setState({ isAuthed: false, username: '', profilePicUrl: '' });
      }
      this.onLogin(this.state.isAuthed);
    });
  }

  googleLogin = () => {
    const provider = new firebase.auth.GoogleAuthProvider();

    firebase.auth().signInWithRedirect(provider);
  }

  googleSignOut = () => {
    firebase.auth().signOut();
  }

  renderLoginComponent = classes => {
    return (
      <Button color="inherit" className={classes.button} onClick={this.googleLogin}>
        Login with Google
      </Button>
    );
  }

  renderLoginedComponent = classes => {
    return (
      <div>
        <Button color="inherit" className={classes.button}>
          <Avatar alt="profile image" src={`${this.state.profilePicUrl}`} className={classes.avatar} />
          {this.state.username}
        </Button>
        <Button color="inherit" className={classes.button} onClick={this.googleSignOut}>Sign Out</Button>
      </div>
    );
  }

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <AppBar position="static" color="primary">
          <Toolbar>
            <Typography variant="title" color="inherit" className={classes.flex}>
              IoT Rice Cooker
            </Typography>
            {this.state.isAuthed ? this.renderLoginedComponent(classes) : this.renderLoginComponent(classes)}
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}

Header.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Header);
