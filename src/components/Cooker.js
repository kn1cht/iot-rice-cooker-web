import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import firebase from 'firebase/app';
import 'firebase/firestore';

const styles = theme => ({
  root: {
    flexGrow: 0,
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
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
      return <Paper className={classes.root}>Loading...</Paper>
    }

    return (
      <Paper className={classes.root}>
        <Table className={classes.table}>
          <TableBody>
            <TableRow>
              <TableCell align="left"> {cooker.name} </TableCell>
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
      </Paper>
    );
  }
}

Cooker.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Cooker);
