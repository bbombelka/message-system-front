import React, { Fragment, useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Button, CircularProgress, Collapse, Divider } from '@material-ui/core';
import { Paper } from '@material-ui/core';
import MessageItem from '../MessageItem/MessageItem';
import ThreadBar from '../ThreadBar/ThreadBar';
import { config } from '../../../config';
import {
  requestService,
  parseAxiosResponse,
  parseErrorResponse,
} from '../../../helpers/request.helper';
import CustomNotification from '../CustomNotification/CustomNotification';
import iconEnum from '../Icon/Icon.enum';
import bool from '../../../enums/bool.enum';

const useStyles = makeStyles(() => ({
  expanderContent: {
    backgroundColor: 'beige',
    margin: '0 12px',
    marginBottom: '12px',
    overflow: 'hidden',
    color: 'rgba(100, 0, 0, 0.87)',
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
  flexAlignCenter: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
}));

const ThreadItem = (props) => {
  const { messageNumber, read, ref, selected, title, type, unreadMessageNumber } = props.thread;
  const { select, markAsRead } = props;
  const [loading, setLoading] = useState(false);
  const [messageContent, setMessageContent] = useState({ messages: [], total: null });
  const [loadingMore, setLoadingMore] = useState(false);
  const [fetchError, setFetchError] = useState(null);
  const classes = useStyles();

  const shouldDisplayLoadMoreButton = messageContent.messages.length < messageContent.total;

  useEffect(() => {
    messageContent.total && (!loading || !loadingMore) && !read && handleReadStatus();
  }, [loading, loadingMore]);

  const onLoadMoreButtonClick = () => {
    const params = {
      ref,
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

  const onSuccessfulMessageFetch = (data) => {
    const parsedMessageContent = parseResponse(data);
    setMessageContent(parsedMessageContent);
    setLoading(false);
    select(ref);
  };

  const parseResponse = (data) => {
    const parsedMessages = data.messages.map((message) => {
      return {
        ...message,
        read: message.read === bool.TRUE,
        processed: message.processed === bool.TRUE,
      };
    });

    return { messages: parsedMessages, total: data.total };
  };

  const handleReadStatus = () => {
    const receivedNumberOfUnreadMessages = messageContent.messages.filter(
      (message) => !message.read
    ).length;
    receivedNumberOfUnreadMessages === unreadMessageNumber && markAsRead(ref);
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

  const onSuccessfulLoadMoreMessagesFetch = ({ messages }) => {
    const parsedMessages = messages.map((message) => {
      return {
        ...message,
        read: message.read === bool.TRUE,
        processed: message.processed === bool.TRUE,
      };
    });

    messageContent.messages.push(...parsedMessages);
    setLoadingMore(false);
  };

  const onThreadBarClick = () => {
    selected ? select(ref) : fetchMessages();
  };

  return (
    <div>
      <ThreadBar
        loading={loading}
        messageNumber={messageNumber}
        onThreadBarClick={onThreadBarClick}
        read={read}
        selected={selected}
        title={title}
        type={type}
      />
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
