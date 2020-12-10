import React from 'react';
import { ContactMailOutlined, Edit, PersonOutline } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Checkbox, Typography } from '@material-ui/core';
import ButtonWithLoader from '../ButtonWithLoader/ButtonWithLoader';

const useStyles = makeStyles({
  root: {
    padding: '12px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '84px',
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
        <Typography align="center" variant="caption">
          {time}
        </Typography>
        <Typography align="center" variant="caption">
          {localeDate}
        </Typography>
      </div>
      {processed !== undefined && (
        <Typography align="center" variant="subtitle2">
          Current status: {processedStatus}
        </Typography>
      )}
      {false && (
        <div>
          <ButtonWithLoader icon={<Edit></Edit>} styles={{ margin: 'auto 0 0 0', backgroundColor: 'white' }}>
            Edit
          </ButtonWithLoader>
        </div>
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
