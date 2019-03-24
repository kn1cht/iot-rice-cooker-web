import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

const styles = {
  card: {
    maxWidth: 275,
    marginButtom: 10,
    marginTop: 10,
  },
  title: {
    fontSize: 14,
  },
};

const CookerSupplyCard = props => {
  const { classes, cooker } = props;

  return (
    <Card className={classes.card}>
      <CardContent>
        <Typography className={classes.title} color="textSecondary" gutterBottom>
          消耗品
        </Typography>
        <Typography variant="h5">
          水タンク
        </Typography>
        <Typography component="p" gutterBottom>
          {cooker.water ? '残量あり' : '残量不足'}
        </Typography>
        <Typography variant="h5">
          廃水タンク
        </Typography>
        <Typography component="p">
          {cooker.waste ? '満水' : '余裕あり'}
        </Typography>
      </CardContent>
    </Card>
  );
}

CookerSupplyCard.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(CookerSupplyCard);
