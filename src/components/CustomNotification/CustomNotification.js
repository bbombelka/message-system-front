import React from 'react';
import { Card, Link, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Icon from '../Icon/Icon';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    paddingRight: '24px',
  },
  icon: {
    padding: '24px',
  },
  title: {
    fontWeight: 'bold',
  },
  link: {
    color: 'rgba(100,0,0,0.87)',
    cursor: 'pointer',
  },
});

const CustomNotification = (props) => {
  const { linkCallback, linkMessage, message, type } = props;
  const classes = useStyles();

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

export default CustomNotification;
