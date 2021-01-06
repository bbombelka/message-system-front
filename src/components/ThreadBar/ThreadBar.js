import React, { useContext } from 'react';
import { Avatar, Checkbox, CircularProgress, Typography } from '@material-ui/core';
import { ExpandMore as ExpandMoreIcon } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import Icon from '../Icon/Icon';
import styles from './styles';
import MainContext from '../MessagesMain/MessagesMainContext';
import modeEnum from '../../../enums/mode.enum';

const ThreadBar = (props) => {
  const {
    loading,
    marked,
    messageNumber,
    onThreadBarClick,
    read,
    reference,
    selected,
    setSnackbarMessage,
    title,
    toggleMark,
    type,
  } = props;
  const { mode } = useContext(MainContext);

  const classes = useStyle({ mode });
  const chevronClassName = classes.chevron.concat(selected ? ` ${classes.chevronSelected}` : '');
  const titleClassName = classes.flexAlignCenter.concat(loading ? ` ${classes.loading}` : '');

  const onClick = () => {
    switch (mode) {
      case modeEnum.MARK_MESSAGE:
      case modeEnum.MARK_THREAD:
        return setSnackbarMessage('Disable mark mode first.');
      case modeEnum.INTERACTION:
        return onThreadBarClick();
      case modeEnum.EDITION:
      case modeEnum.FILE_UPLOAD:
      case modeEnum.SEND_MESSAGE:
        return setSnackbarMessage('Please close message editor before selecting another thread.');
      default:
        return onThreadBarClick();
    }
  };

  return (
    <div onClick={onClick} className={classes.root}>
      <div>
        <Avatar classes={{ root: classes.avatar, colorDefault: classes.avatarColor }}>
          <Icon type={type} />
        </Avatar>
      </div>
      <div className={titleClassName}>
        <Typography classes={{ root: !read ? ` ${classes.bold}` : '' }}>{title}</Typography>
      </div>
      <div className={classes.flexAlignCenter}>
        <Typography>{messageNumber}</Typography>
      </div>
      <div className={classes.flexAlignCenter}>
        {mode === modeEnum.MARK_THREAD ? (
          <Checkbox
            color="default"
            checked={marked}
            onClick={(e) => e.stopPropagation()}
            onChange={() => toggleMark(reference, !marked)}
            classes={{ root: classes.checkBox, checked: classes.checkBox }}
          />
        ) : (
          <ExpandMoreIcon className={chevronClassName} />
        )}
      </div>
      {loading && <CircularProgress size={24} className={classes.loader} />}
    </div>
  );
};

const useStyle = makeStyles(styles);

export default ThreadBar;
