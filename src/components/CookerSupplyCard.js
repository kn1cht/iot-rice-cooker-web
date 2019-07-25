import classNames from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons'
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

library.add(
  faCheckCircle,
  faTimesCircle
)

const styles = {
  card: {
    maxWidth: 500,
    marginButtom: 10,
    marginTop: 10,
  },
  title: {
    fontSize: 14,
  },
  leftIcon: {
    marginRight: 4,
  },
  greenIcon: {
    color: 'limegreen',
  },
  redIcon: {
    color: 'red',
  },
};

const CookerSupplyCard = props => {
  const { classes, cooker } = props;

  const supplyIcon = ok => {
    return ok ? (
      <FontAwesomeIcon className={classNames(classes.leftIcon, classes.greenIcon)}
      icon={faCheckCircle} size="lg" />
    ) : (
      <FontAwesomeIcon className={classNames(classes.leftIcon, classes.redIcon)}
      icon={faTimesCircle} size="lg" />
    );
  };

  return (
    <Card className={classes.card}>
      <CardContent>
        <Typography className={classes.title} color="textSecondary" gutterBottom>
          消耗品
        </Typography>
        <Typography variant="h5" gutterBottom>
          米びつ
        </Typography>
        <Typography component="p" gutterBottom>
          {supplyIcon(!cooker.isRiceShortage)}
          {cooker.isRiceShortage ? '残量不足' : '残量あり'}
        </Typography>
        <Typography variant="h5" gutterBottom>
          給水タンク
        </Typography>
        <Typography component="p" gutterBottom>
          {supplyIcon(cooker.water)}
          {cooker.water ? '残量あり' : '残量不足'}
        </Typography>
        <Typography variant="h5" gutterBottom>
          排水タンク
        </Typography>
        <Typography component="p" gutterBottom>
          {supplyIcon(!cooker.waste)}
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
