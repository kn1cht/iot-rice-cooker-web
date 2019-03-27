import React from 'react';
import PropTypes from 'prop-types';
import styled, { keyframes } from "styled-components";
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCog, faPowerOff } from '@fortawesome/free-solid-svg-icons'
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import 'firebase/firestore';

library.add(faCog, faPowerOff);

const styles = {
  card: {
    maxWidth: 500,
    marginButtom: 10,
    marginTop: 10,
  },
  leftIcon: {
    marginRight: 10,
  },
  title: {
    fontSize: 14,
  },
};

const spin = keyframes`
0% { transform: rotate(0deg); }
100% { transform: rotate(360deg); }
`;

const Spinner = styled.div`
animation: ${spin} infinite 5s linear;
display: inline-block;
`;

const CookerSummaryCard = props => {
  const { classes, cooker, cookerRef } = props;

  const activeIcon = () => {
    if(cooker.active) return (
      <Spinner className={classes.leftIcon}>
        <FontAwesomeIcon icon={faCog} size="lg" />
      </Spinner>
    );
    else return (
      <FontAwesomeIcon className={classes.leftIcon} icon={faPowerOff} size="lg" />
    );
  }

  const startCooking = async() => {
    const amount = 1; // TODO: 指定できるように
    if(amount <= 0 || cooker.weight <= -30 || cooker.weight >= 30) {
      // TODO: Error
    }
    else {
      await cookerRef.update({ amount }).catch((err) => { console.error(err); });
    }
  }

  const abortCooking = async() => { // TODO: 本当に中止させる
    console.log(cookerRef);
    await cookerRef.update({ active: false, amount: 0 }).catch((err) => { console.error(err); });
  }

  const cookingButton = () => {
    if(cooker.amount) return (
      <Button onClick={abortCooking} size="small" variant="contained" color="secondary">中止</Button>
    );
    else return (
      <Button onClick={startCooking} size="small" variant="contained" color="primary">炊飯開始</Button>
    );
  }

  return (
    <Card className={classes.card}>
      <CardContent>
        <Typography className={classes.title} color="textSecondary" gutterBottom>
          概要
        </Typography>
        <Typography variant="h4" component="h2" gutterBottom>
          {activeIcon()}
          {cooker.active ? '炊飯中' : '待機中'}
        </Typography>
        <Typography variant="h5" gutterBottom>
          炊飯量 {cooker.amount} 合
        </Typography>
        <Typography variant="h5" gutterBottom>
          釜内重量 {cooker.weight} g
        </Typography>
      </CardContent>
      <CardActions>
        {cookingButton()}
      </CardActions>
    </Card>
  );
}

CookerSummaryCard.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(CookerSummaryCard);
