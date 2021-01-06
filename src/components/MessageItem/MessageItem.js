import React from 'react';
import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import MessageItemAvatar from '../MessageItemAvatar/MessageItemAvatar';
import AttachmentsArea from '../AttachmentsArea/AttachmentsArea';

const MessageItem = (props) => {
  const { attachments = [], date, lastUpdated, marked, processed, ref, text, type } = props.message;
  const { toggleMarkStatus } = props;
  const classes = useStyles();

  return (
    <React.Fragment>
      <div className={classes.root}>
        <MessageItemAvatar
          date={date}
          lastUpdated={lastUpdated}
          marked={marked}
          processed={processed}
          reference={ref}
          toggleMarkStatus={toggleMarkStatus}
          type={type}
        />
        <div>
          <Typography classes={{ root: classes.content }}>
            <span dangerouslySetInnerHTML={{ __html: text }}></span>
          </Typography>
          <div id="message-item">
            {Boolean(attachments.length) ? <AttachmentsArea attachments={attachments} reference={ref} key={ref} /> : ''}
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

const useStyles = makeStyles({
  root: {
    display: 'flex',
  },
  content: {
    padding: '12px',
    wordBreak: 'break-word',
  },
});

export default MessageItem;
