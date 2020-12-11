import React from 'react';
import { Card, Link, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Icon from '../Icon/Icon';
import styles from './styles';

const CustomNotification = (props) => {
  const { linkCallback, linkMessage, message, type } = props;
  const classes = useStyles(props);

  return (
    <Card className={classes.root}>
      <div className={classes.icon}>
        <Icon size="60" type={type} />
      </div>
      <div className={classes.body}>
        <Typography classes={{ root: classes.title }} variant="body1">
          {message}
        </Typography>
        <Typography>
          <Link classes={{ root: classes.link }} onClick={(e) => linkCallback(e)}>
            {linkMessage}
          </Link>
        </Typography>
      </div>
    </Card>
  );
};

const useStyles = makeStyles(styles);
export default CustomNotification;
