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
  },
  table: {
    minWidth: 300,
    width: '40%',
  },
});

class Cooker extends Component {
  constructor(props) {
    super(props);

    this.state = { user: {}, cooker: {} }
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
      user: users[0],
      cooker
    });
  }

  render() {
    const { classes } = this.props;

    return (
      <Paper className={classes.root}>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell> Name </TableCell>
              <TableCell align="right"> {this.state.cooker.name} </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell> active </TableCell>
              <TableCell align="right"> {this.state.cooker.active} </TableCell>
            </TableRow>
            <TableRow>
              <TableCell> amount </TableCell>
              <TableCell align="right"> {this.state.cooker.amount} 合 </TableCell>
            </TableRow>
            <TableRow>
              <TableCell> weight </TableCell>
              <TableCell align="right"> {this.state.cooker.weight} g </TableCell>
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
