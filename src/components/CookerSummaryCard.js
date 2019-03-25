import React from 'react';
import PropTypes from 'prop-types';
import styled, { keyframes } from "styled-components";
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCog } from '@fortawesome/free-solid-svg-icons'
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

library.add(
  faCog
)

const styles = {
  card: {
    maxWidth: 275,
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
  const { classes, cooker } = props;

  return (
    <Card className={classes.card}>
      <CardContent>
        <Typography className={classes.title} color="textSecondary" gutterBottom>
          概要
        </Typography>
        <Typography variant="h4" component="h2" gutterBottom>
          <Spinner className={classes.leftIcon}>
            <FontAwesomeIcon icon={faCog} size="lg" />
          </Spinner>
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
