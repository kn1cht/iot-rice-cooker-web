import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import 'firebase/firestore';

const styles = theme => ({
  root: {
    flexGrow: 0,
    marginTop: theme.spacing.unit,
    overflowX: 'auto',
    padding: 30,
  }
});

class Top extends Component {
  constructor(props) {
    super(props);

    this.state = { user: {}, cooker: {} }
  }

  async componentWillMount() {
    const users = [];
    this.setState({
      user: users[0]
    });
  }

  render() {
    const { classes } = this.props;

    return (
      <Paper className={classes.root}>
      <Typography variant="h2" gutterBottom={true}>
        Welcome to IoT Rice Cooker Dashboard.
      </Typography>
      <Button variant="contained" color="primary" href="dashboard" className={classes.button}>
        Go to Dashboard
      </Button>
      </Paper>
    );
  }
}

Top.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Top);
