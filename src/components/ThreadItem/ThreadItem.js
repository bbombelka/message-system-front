import React, { Fragment, useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Avatar, Button, CircularProgress, Collapse, Divider } from '@material-ui/core';
import { Paper, Typography } from '@material-ui/core';
import { ExpandMore as ExpandMoreIcon } from '@material-ui/icons';
import Icon from '../Icon/Icon';
import MessageItem from '../MessageItem/MessageItem';
import { config } from '../../../config';
import {
  requestService,
  parseAxiosResponse,
  parseErrorResponse,
} from '../../../helpers/request.helper';
import CustomNotification from '../CustomNotification/CustomNotification';
import iconEnum from '../Icon/Icon.enum';

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
    position: 'relative',
  },
  buttonLoader: {
    position: 'absolute',
    top: '20%',
  },
}));

const ThreadItem = (props) => {
  const { messageNumber, ref, selected, title, type } = props.thread;
  const { select } = props;
  const [loading, setLoading] = useState(false);
  const [messageContent, setMessageContent] = useState({ messages: [], total: null });
  const [loadingMore, setLoadingMore] = useState(false);
  const [fetchError, setFetchError] = useState(null);
  const classes = useStyles();

  const shouldDisplayLoadMoreButton = messageContent.messages.length < messageContent.total;
  const chevronClassName = classes.chevron.concat(selected ? ` ${classes.chevronSelected}` : '');
  const titleClassName = classes.flexAlignCenter.concat(loading ? ` ${classes.loading}` : '');

  const onLoadMoreButtonClick = () => {
    const params = {
      num: config.NUMBER_OF_FETCHED_MESSAGES,
      skip: messageContent.messages.length,
    };

    fetchMoreMessages(params);
  };

  const fetchMoreMessages = async (params) => {
    try {
      setLoadingMore(true);
      const response = parseAxiosResponse(await requestService('getmessages', params));
      onSuccessfulLoadMoreMessagesFetch(response.data);
    } catch (error) {
      const message = parseErrorResponse(error);
      onFailedMoreMessageFetch(message);
    }
  };

  const onFailedMoreMessageFetch = (message) => {
    setFetchError({
      message,
      linkMessage: 'Try again.',
      callback: () => fetchErrorCallback(),
    });
    setLoadingMore(false);
  };

  const fetchMessages = async () => {
    const params = {
      ref,
      num: config.NUMBER_OF_FETCHED_MESSAGES,
      skip: 0,
    };

    try {
      setLoading(true);
      const response = parseAxiosResponse(await requestService('getmessages', params));
      onSuccessfulMessageFetch(response.data);
    } catch (error) {
      const message = parseErrorResponse(error);
      onFailedFetch(message);
    }
  };
  const onFailedFetch = (message) => {
    setFetchError({
      message,
      linkMessage: 'Try again.',
      callback: () => fetchErrorCallback(),
    });
    setLoading(false);
    select(ref);
  };

  const fetchErrorCallback = () => {
    select(ref);
    setFetchError(null);
    fetchMessages();
  };

  const onSuccessfulMessageFetch = (data) => {
    setMessageContent(data);
    setLoading(false);
    select(ref);
  };

  const onSuccessfulLoadMoreMessagesFetch = ({ messages }) => {
    messageContent.messages.push(...messages);
    setLoadingMore(false);
  };

  const onThreadBarClick = () => {
    selected ? select(ref) : fetchMessages();
  };

  return (
    <div>
      <div onClick={() => onThreadBarClick()} className={classes.bar}>
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
                <Fragment key={index}>
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
                  disabled={Boolean(fetchError)}
                >
                  {loadingMore && <CircularProgress className={classes.buttonLoader} size={24} />}
                  Load more
                </Button>
              </div>
            )}
            {fetchError && (
              <CustomNotification
                backgroundColor={'white'}
                linkCallback={fetchError.callback}
                linkMessage={fetchError.linkMessage}
                message={fetchError.message}
                type={iconEnum.ERROR}
              />
            )}
          </Paper>
        </Collapse>
      </div>
      <Divider variant="middle" />
    </div>
  );
};

export default ThreadItem;
