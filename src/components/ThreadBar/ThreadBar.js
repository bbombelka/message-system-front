import React from 'react';
import { Avatar, CircularProgress, Typography } from '@material-ui/core';
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
    cursor: 'pointer',
    transition: 'all .2s',
    '& div': {
      padding: '12px',
    },
    '& div:nth-of-type(3)': {
      marginLeft: 'auto',
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
});

const ThreadBar = (props) => {
  const { loading, messageNumber, onThreadBarClick, read, selected, title, type } = props;
  const classes = useStyle();
  const chevronClassName = classes.chevron.concat(selected ? ` ${classes.chevronSelected}` : '');
  const titleClassName = classes.flexAlignCenter.concat(loading ? ` ${classes.loading}` : '');

  return (
    <div onClick={() => onThreadBarClick()} className={classes.root}>
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
        <ExpandMoreIcon className={chevronClassName} />
      </div>
      {loading && <CircularProgress size={24} className={classes.loader} />}
    </div>
  );
};

export default ThreadBar;
