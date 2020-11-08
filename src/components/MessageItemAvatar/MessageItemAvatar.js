import React from 'react';
import { ContactMailOutlined, PersonOutline } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import { Checkbox, Typography } from '@material-ui/core';
import messageTypeEnum from '../../../enums/messageType.enum';

const useStyles = makeStyles({
  root: {
    padding: '12px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '80px',
  },
  icon: { padding: '12px' },
  date: { fontSize: '10px' },
  checkBox: {
    color: 'rgba(100,0,0,0.87)',
    '& checked': {
      color: 'rgba(100,0,0,0.87)',
    },
  },
  checked: {},
});

const MessageItemAvatar = (props) => {
  const { date, marked, markMode, processed, reference, toggleMarkStatus, type } = props;
  const time = new Date(date).toLocaleTimeString().slice(0, 5);
  const localeDate = new Date(date).toLocaleDateString();
  const processedStatus = processed ? 'Read by consultant' : 'Awaiting consideration';
  const classes = useStyles();

  const avatarIcon =
    processed === undefined ? (
      <ContactMailOutlined className={classes.icon} />
    ) : (
      <PersonOutline className={classes.icon} />
    );

  return (
    <div className={classes.root}>
      {avatarIcon}
      <div>
        <Typography align="center" variant="body2">
          {time}
        </Typography>
        <Typography align="center" variant="body2">
          {localeDate}
        </Typography>
      </div>
      {processed !== undefined && (
        <Typography align="center" variant="subtitle2">
          Current status: {processedStatus}
        </Typography>
      )}
      {markMode && (
        <Checkbox
          color="default"
          checked={marked}
          onChange={() => toggleMarkStatus(reference, !marked)}
          classes={{ root: classes.checkBox, checked: classes.checkBox }}
        />
      )}
    </div>
  );
};

export default MessageItemAvatar;
