import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import firebase from 'firebase/app';
import 'firebase/firestore';
import CookerSummaryCard from './CookerSummaryCard';
import CookerSupplyCard from './CookerSupplyCard';

const styles = theme => ({
  root: {
    flexGrow: 0,
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
      loading : true,
      user: {},
    };
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
    const cookerSnapshot = await users[0].cookers[0].get().catch((err) => console.error(err));
    const cooker = cookerSnapshot.data();

    this.setState({
      cooker,
      user: users[0],
      loading: false
    });
  }

  render() {
    const { classes } = this.props;
    const { cooker, loading } = this.state;
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
      <Grid container spacing={24} className={classes.root}>
        <Grid item xs={12}>
          <Paper className={classes.paper}>
            <Typography variant="h4">
              {cooker.name}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={2}>
          <CookerSummaryCard cooker={cooker} ></CookerSummaryCard>
        </Grid>
        <Grid item xs={2}>
          <CookerSupplyCard cooker={cooker} ></CookerSupplyCard>
        </Grid>
        <Grid item xs={4}>
          <Table className={classes.table}>
            <TableBody>
              <TableRow>
                <TableCell align="left">  </TableCell>
              </TableRow>
              <TableRow>
                <TableCell align="left"> {cooker.active ? '炊飯中' : '待機中'} </TableCell>
              </TableRow>
              <TableRow>
                <TableCell align="left"> 炊飯量 {cooker.amount} 合 </TableCell>
              </TableRow>
              <TableRow>
                <TableCell align="left"> 釜内重量 {cooker.weight} g </TableCell>
              </TableRow>
              <TableRow>
                <TableCell align="left"> 水タンク {cooker.water ? '残量あり' : '残量不足'}  </TableCell>
              </TableRow>
              <TableRow>
                <TableCell align="left"> 廃水タンク {cooker.waste ? '満水' : '余裕あり'}  </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Grid>
      </Grid>
    );
  }
}

Cooker.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Cooker);
