import React from 'react';
import { Avatar, Checkbox, CircularProgress, Typography } from '@material-ui/core';
import { ExpandMore as ExpandMoreIcon } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import Icon from '../Icon/Icon';
import styles from './styles';

const ThreadBar = (props) => {
  const {
    loading,
    marked,
    messageMarkMode,
    threadMarkMode,
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
  const classes = useStyle(props);
  const chevronClassName = classes.chevron.concat(selected ? ` ${classes.chevronSelected}` : '');
  const titleClassName = classes.flexAlignCenter.concat(loading ? ` ${classes.loading}` : '');

  const onClick = (e) => {
    threadMarkMode || messageMarkMode ? setSnackbarMessage('Disable mark mode first.') : onThreadBarClick();
  };

  const onCheckboxChange = (e) => {
    toggleMark(reference, !marked);
  };

  return (
    <div onClick={onClick} className={classes.root}>
      <div>
        <Avatar
          classes={{
            root: classes.avatar,
            colorDefault: classes.avatarColor,
          }}
        >
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
        {threadMarkMode ? (
          <Checkbox
            color="default"
            checked={marked}
            onClick={(e) => e.stopPropagation()}
            onChange={onCheckboxChange}
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
