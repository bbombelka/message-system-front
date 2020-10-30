import React from 'react';
import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import MessageItemAvatar from '../MessageItemAvatar/MessageItemAvatar';
import AttachmentsArea from '../AttachmentsArea/AttachmentsArea';

const useStyles = makeStyles({
  root: {
    display: 'flex',
  },
  content: {
    padding: '12px',
  },
});

const MessageItem = (props) => {
  const { attachments = [], date, processed, ref, text, type } = props.message;
  const classes = useStyles();

  return (
    <React.Fragment>
      <div className={classes.root}>
        <MessageItemAvatar date={date} type={type} processed={processed} />
        <div>
          <Typography classes={{ root: classes.content }}>
            <span dangerouslySetInnerHTML={{ __html: text }}></span>
          </Typography>
          {attachments.length && (
            <AttachmentsArea attachments={attachments} reference={ref} key={ref} />
          )}
        </div>
      </div>
    </React.Fragment>
  );
};

export default MessageItem;
