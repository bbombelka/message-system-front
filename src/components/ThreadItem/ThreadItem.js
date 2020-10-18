import React, { Fragment } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Avatar, Button, CircularProgress, Collapse, Divider } from '@material-ui/core';
import { Paper, Typography } from '@material-ui/core';
import { ExpandMore as ExpandMoreIcon } from '@material-ui/icons';
import Icon from '../Icon/Icon';
import MessageItem from '../MessageItem/MessageItem';
import { config } from '../../../config';

const useStyles = makeStyles(() => ({
  avatar: {
    width: '24px',
    height: '24px',
    boxShadow: '0px 0px 0 1px rgba(100,0,0,0.87)',
  },
  avatarColor: {
    backgroundColor: 'beige',
  },
  bar: {
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
  chevron: {
    transition: 'transform .2s',
  },
  chevronSelected: {
    transform: 'scale(-1)',
  },
  expanderContent: {
    backgroundColor: 'beige',
    margin: '0 12px',
    marginBottom: '12px',
    overflow: 'hidden',
    color: 'rgba(100, 0, 0, 0.87)',
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
  loadMoreButton: {
    margin: '12px',
    color: 'rgba(100, 0, 0, 0.87)',
  },
}));

const ThreadItem = (props) => {
  const { loading, messageContent, ref, title, messageNumber, type, selected } = props.thread;
  const { select } = props;
  const shouldDisplayLoadMoreButton = messageContent.messages.length < messageContent.total;
  const classes = useStyles();
  const chevronClassName = classes.chevron.concat(selected ? ` ${classes.chevronSelected}` : '');
  const titleClassName = classes.flexAlignCenter.concat(loading ? ` ${classes.loading}` : '');

  const onLoadMoreButtonClick = () => {
    const params = {
      num: config.NUMBER_OF_FETCHED_MESSAGES,
      skip: messageContent.messages.length,
    };
    select(ref, params);
  };

  return (
    <div>
      <div onClick={() => select(ref)} className={classes.bar}>
        <div className={classes.icon}>
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
          <Typography>{title}</Typography>
        </div>
        <div className={classes.flexAlignCenter}>
          <Typography>{messageNumber}</Typography>
        </div>
        <div className={classes.flexAlignCenter}>
          <ExpandMoreIcon className={chevronClassName} />
        </div>
        {loading && <CircularProgress size={24} className={classes.loader} />}
      </div>
      <div className={classes.message}>
        <Collapse in={selected}>
          <Paper className={classes.expanderContent}>
            {messageContent.messages.map((message, index) => {
              const isLast = messageContent.length - 1 === index;
              return (
                <Fragment>
                  <MessageItem message={message} key={message.ref} />
                  {!isLast && <Divider variant="middle" key={index} />}
                </Fragment>
              );
            })}
            {shouldDisplayLoadMoreButton && (
              <div className={classes.flexAlignCenter}>
                <Button
                  onClick={() => onLoadMoreButtonClick()}
                  classes={{ root: classes.loadMoreButton }}
                  variant="outlined"
                >
                  Load more
                </Button>
              </div>
            )}
          </Paper>
        </Collapse>
      </div>
      <Divider variant="middle" />
    </div>
  );
};

export default ThreadItem;
