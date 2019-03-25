import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import firebase from 'firebase/app';
import 'firebase/firestore';
import CookerSummaryCard from './CookerSummaryCard';
import CookerSupplyCard from './CookerSupplyCard';

const styles = theme => ({
  root: {
    flexGrow: 1,
    marginTop: theme.spacing.unit,
    overflowX: 'auto',
    padding: 5,
  },
  paper: {
    padding: 30,
  },
  table: {
    maxWidth: 500,
  },
});

class Cooker extends Component {
  constructor(props) {
    super(props);

    this.state = {
      cooker: {},
      cookerRef: {},
      loading : true,
      user: {},
    };
  }

  async reloadCookerData() {
    const cooker = (await this.state.cookerRef.get().catch((err) => console.error(err))).data();
    this.setState({ cooker });
  }

  async componentWillMount() {
    const users = [];
    const collection = firebase.firestore().collection('users').where('name', '==', 'koichaman').limit(50);
    const usersSnapshot = await collection.get().catch((err) => console.error(err));
    usersSnapshot.forEach((doc) => {
      const d = doc.data();
      users.push({ name: d.name, cookers: d.cookers });
    });
    console.log(users[0]);
    const cookerRef = users[0].cookers[0];
    const cooker = (await cookerRef.get().catch((err) => console.error(err))).data();

    this.setState({
      cooker,
      cookerRef,
      user: users[0],
      loading: false
    });
    this.interval = setInterval(() => {
      this.reloadCookerData();
    }, 500);
  }

  render() {
    const { classes } = this.props;
    const { cooker, cookerRef, loading } = this.state;
    if (loading) {
      return (
      <Grid container spacing={24} className={classes.root}>
        <Paper className={classes.paper}>
          <Typography variant="body1" gutterBottom={true}>
            Loading...
          </Typography>
        </Paper>
      </Grid>
      );
    }

    return (
      <Grid container spacing={24} justify="center" className={classes.root}>
        <Grid item xs={12}>
          <Paper className={classes.paper}>
            <Typography variant="h4">
              {cooker.name}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm>
          <CookerSummaryCard cooker={cooker} cookerRef={cookerRef} ></CookerSummaryCard>
        </Grid>
        <Grid item xs={12} sm>
          <CookerSupplyCard cooker={cooker} ></CookerSupplyCard>
        </Grid>
      </Grid>
    );
  }
}

Cooker.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Cooker);
