import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Avatar,
  CircularProgress,
  Collapse,
  Divider,
  Typography,
} from '@material-ui/core';
import { ExpandMore as ExpandMoreIcon } from '@material-ui/icons';
import ThreadIcon from '../ThreadIcon/ThreadIcon';

const useStyles = makeStyles(() => ({
  bar: {
    position: 'relative',
    display: 'flex',
    flexWrap: 'nowrap',
    transition: 'all .2s',
    '& div': {
      padding: '12px',
    },
    '& div:nth-of-type(3)': {
      marginLeft: 'auto',
    },
  },
  loading: {
    opacity: '.5',
  },
  avatar: {
    width: '24px',
    height: '24px',
  },
  chevron: {
    transition: 'transform .2s',
  },
  chevronSelected: {
    transform: 'scale(-1)',
  },
  loader: {
    position: 'absolute',
    top: 'calc(50% - 24px)',
    left: 'calc(50% - 24px)',
  },
}));

const ThreadItem = (props) => {
  const {
    loading,
    messageContent,
    ref,
    title,
    messageNumber,
    type,
    selected,
  } = props.thread;
  const { select } = props;

  const classes = useStyles();

  const chevronClassName = classes.chevron.concat(
    selected ? ` ${classes.chevronSelected}` : ''
  );

  const titleClassName = loading ? classes.loading : '';

  return (
    <div>
      <div onClick={() => select(ref)} className={classes.bar}>
        <div className={classes.icon}>
          <Avatar classes={{ root: classes.avatar }}>
            <ThreadIcon type={type} />
          </Avatar>
        </div>
        <div className={titleClassName}>
          <Typography>{title}</Typography>
        </div>
        <div className={classes.counter}>{messageNumber}</div>
        <div>
          <ExpandMoreIcon className={chevronClassName} />
        </div>
        {loading && <CircularProgress size={24} className={classes.loader} />}
      </div>
      <div className={classes.message}>
        <Collapse in={selected}>
          <Typography>
            <div dangerouslySetInnerHTML={{ __html: '<h1>Chuchu</h1>' }}></div>
          </Typography>
        </Collapse>
      </div>

      <Divider variant="middle" />
    </div>
  );
};

export default ThreadItem;
