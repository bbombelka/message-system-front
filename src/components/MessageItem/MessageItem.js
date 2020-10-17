import React from 'react';
import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import MessageItemAvatar from '../MessageItemAvatar/MessageItemAvatar';

const useStyles = makeStyles({
  root: {
    display: 'flex',
  },
  content: {
    padding: '12px',
  },
});

const MessageItem = (props) => {
  const { date, type, processed, text } = props.message;
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <MessageItemAvatar date={date} type={type} processed={processed} />
      <Typography classes={{ root: classes.content }}>
        <span dangerouslySetInnerHTML={{ __html: text }}></span>
      </Typography>
    </div>
  );
};

export default MessageItem;
