import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
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

const CookerSummaryCard = props => {
  const { classes, cooker } = props;

  return (
    <Card className={classes.card}>
      <CardContent>
        <Typography className={classes.title} color="textSecondary" gutterBottom>
          概要
        </Typography>
        <Typography variant="h4" component="h2" gutterBottom>
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
        <Button size="small" color="primary">編集</Button>
      </CardActions>
    </Card>
  );
}

CookerSummaryCard.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(CookerSummaryCard);
