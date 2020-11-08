import React from 'react';
import { Avatar, Checkbox, CircularProgress, Typography } from '@material-ui/core';
import { ExpandMore as ExpandMoreIcon } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import Icon from '../Icon/Icon';

const useStyle = makeStyles({
  avatar: {
    width: '24px',
    height: '24px',
    boxShadow: '0px 0px 0 1px rgba(100,0,0,0.87)',
  },
  avatarColor: {
    backgroundColor: 'beige',
  },
  root: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'nowrap',
    cursor: ({ threadMarkMode, messageMarkMode }) =>
      threadMarkMode || messageMarkMode ? 'not-allowed' : 'pointer',
    transition: 'all .2s',
    '& div': {
      padding: '12px',
    },
    '& div:nth-of-type(3)': {
      marginLeft: 'auto',
    },
    '& div:nth-of-type(4)': {
      width: '42px',
      color: 'rgba(100,0,0,0.87)',
    },
  },
  bold: {
    fontWeight: 'bold',
  },
  chevron: {
    transition: 'transform .2s',
  },
  chevronSelected: {
    transform: 'scale(-1)',
  },
  flexAlignCenter: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loader: {
    position: 'absolute',
    top: 'calc(50% - 24px)',
    left: 'calc(50% - 24px)',
  },
  loading: {
    opacity: '.5',
  },
  checkBox: {
    color: 'rgba(100,0,0,0.87)',
    '& checked': {
      color: 'rgba(100,0,0,0.87)',
    },
  },
  checked: {},
});

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
    title,
    toggleMark,
    type,
  } = props;
  const classes = useStyle(props);
  const chevronClassName = classes.chevron.concat(selected ? ` ${classes.chevronSelected}` : '');
  const titleClassName = classes.flexAlignCenter.concat(loading ? ` ${classes.loading}` : '');

  const onClick = () => {
    threadMarkMode || messageMarkMode
      ? console.log('display info to disable mark mode first')
      : onThreadBarClick();
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

export default ThreadBar;
