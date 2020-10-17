import React from 'react';
import { ContactMailOutlined, PersonOutline } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
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
});

const MessageItemAvatar = (props) => {
  const { date, processed, type } = props;
  const time = new Date(date).toLocaleTimeString().slice(0, 5);
  const localeDate = new Date(date).toLocaleDateString();
  const processedStatus = processed
    ? 'W trakcie rozpatrywania'
    : 'Oczekuje na rozpatrzenie';
  const classes = useStyles();

  const avatarIcon =
    type === messageTypeEnum.INTERNAL ? (
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
      {type === messageTypeEnum.OUTER && (
        <Typography align="center" variant="subtitle2">
          {processedStatus}
        </Typography>
      )}
    </div>
  );
};

export default MessageItemAvatar;
