import React, { Fragment, Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Collapse, Divider, Paper } from '@material-ui/core';
import MessageItem from '../MessageItem/MessageItem';
import ThreadBar from '../ThreadBar/ThreadBar';
import { config } from '../../../config';
import { errorHandler } from '../../../helpers/request.helper';
import CustomNotification from '../CustomNotification/CustomNotification';
import iconEnum from '../Icon/Icon.enum';
import bool from '../../../enums/bool.enum';
import ButtonWithLoader from '../ButtonWithLoader/ButtonWithLoader';
import { AddCircle } from '@material-ui/icons';
import Services from '../../Services';

class ThreadItem extends Component {
  state = {
    loading: false,
    messageContent: { messages: [], total: null },
    fetchError: null,
    loadingMore: false,
  };

  fetchMessages = async () => {
    const { ref } = this.props.thread;
    const params = {
      ref,
      num: config.NUMBER_OF_FETCHED_MESSAGES,
      skip: 0,
    };

    try {
      this.setState({ loading: true });
      const response = await Services.getMessages(params);
      this.onSuccessfulMessageFetch(response.data);
    } catch (error) {
      const options = {
        error,
        logout: this.props.logout,
        repeatedCallback: this.fetchMessages,
        errorCallback: this.onFailedFetch,
        errorMessage: true,
      };
      errorHandler(options);
    }
  };

  onSuccessfulMessageFetch = (data) => {
    const { ref } = this.props.thread;
    const parsedMessageContent = { messages: this.parseMessages(data.messages), total: data.total };
    this.setState({ messageContent: parsedMessageContent, loading: false, threadRef: ref }, () =>
      this.onMessageContentSet()
    );
  };

  onMessageContentSet = () => {
    const { read, ref } = this.props.thread;
    if (read) {
      return this.props.select(ref);
    }
    this.handleReadStatus();
  };

  onFailedFetch = (message) => {
    const { ref } = this.props.thread;
    this.setState(
      {
        fetchError: this.getFetchError(message),
        loading: false,
      },
      () => this.props.select(ref)
    );
  };

  getFetchError = (message) => {
    return {
      message,
      linkMessage: 'Try again.',
      callback: () => this.fetchErrorCallback(),
    };
  };

  parseMessages = (messages) => {
    return messages.map((message) => {
      const { processed = undefined } = message;
      const parsedProcessedValue = processed === undefined ? undefined : processed === bool.TRUE;
      return {
        ...message,
        read: message.read === bool.TRUE,
        attachments: message.attach,
        marked: false,
        processed: parsedProcessedValue,
      };
    });
  };

  fetchMoreMessages = async (params) => {
    try {
      this.setState({ loadingMore: true });
      const response = await Services.getMessages(params);
      this.onSuccessfulLoadMoreMessagesFetch(response.data);
    } catch (error) {
      const options = {
        error,
        logout: this.props.logout,
        repeatedCallback: this.fetchMoreMessages,
        repeatedCallbackParams: params,
        errorCallback: this.onFailedMoreMessageFetch,
        errorMessage: true,
      };
      errorHandler(options);
    }
  };

  onSuccessfulLoadMoreMessagesFetch = ({ messages }) => {
    const parsedMessages = this.parseMessages(messages);
    this.setState(
      {
        messageContent: {
          total: this.state.messageContent.total,
          messages: [...this.state.messageContent.messages, ...parsedMessages],
        },
        loadingMore: false,
      },
      () => !this.props.thread.read && this.handleReadStatus()
    );
  };

  onFailedMoreMessageFetch = (message) => {
    this.setState({
      fetchError: this.getFetchError(message),
      loadingMore: false,
    });
  };

  handleReadStatus = () => {
    const { ref, unreadMessageNumber } = this.props.thread;
    const { messages } = this.state.messageContent;
    const receivedNumberOfUnreadMessages = messages.filter((message) => !message.read).length;
    if (receivedNumberOfUnreadMessages === unreadMessageNumber) {
      return this.props.markAsRead(ref);
    }
    this.props.select(ref);
  };

  fetchErrorCallback = () => {
    const { ref } = this.props.thread;
    this.props.select(ref);
    this.setState({ fetchError: null });
    this.fetchMessages();
  };

  toggleMessageMarkStatus = (ref, bool, options = {}) => {
    const isBulkMarkMode = options.hasOwnProperty('mark');
    const { mark } = options;
    const { messageContent } = this.state;
    const updatedMessages = messageContent.messages.map((message) => {
      const marked = isBulkMarkMode ? (mark ? true : false) : message.ref === ref ? bool : message.marked;
      return {
        ...message,
        marked,
      };
    });
    this.setState({
      messageContent: { messages: updatedMessages, total: messageContent.total },
    });
  };

  toggleMarkThread = (ref, bool, options = {}) => {
    const isBulkMarkMode = options.hasOwnProperty('mark');
    const { mark } = options;

    this.setState({
      threads: this.state.threads.map((thread) => {
        const marked = isBulkMarkMode ? (mark ? true : false) : thread.ref === ref ? bool : thread.marked;

        return { ...thread, marked };
      }),
    });
  };

  onThreadBarClick = () => {
    const { ref, selected } = this.props.thread;
    this.setState({ fetchError: null });
    selected ? this.props.select(ref) : this.fetchMessages();
  };

  onLoadMoreButtonClick = () => {
    const { ref } = this.props.thread;
    const { messageContent } = this.state;

    const params = {
      ref,
      num: config.NUMBER_OF_FETCHED_MESSAGES,
      skip: messageContent.messages.length,
    };

    this.fetchMoreMessages(params);
  };

  onNewMessageAdded = (messages) => {
    const parsedMessage = this.parseMessages(messages).pop();
    this.setState({
      messageContent: {
        total: this.state.messageContent.total,
        messages: [parsedMessage, ...this.state.messageContent.messages],
      },
      loadingMore: false,
    });
  };

  render() {
    const { ref, marked, messageNumber, read, selected, title, type } = this.props.thread;
    const { classes, toggleMark } = this.props;
    const { loading, messageContent, fetchError, loadingMore } = this.state;
    const shouldDisplayLoadMoreButton = messageContent.messages.length < messageContent.total;

    return (
      <div>
        <ThreadBar
          blocked={this.props.blocked}
          loading={loading}
          marked={marked}
          messageNumber={messageNumber}
          onThreadBarClick={this.onThreadBarClick}
          read={read}
          reference={ref}
          selected={selected}
          setSnackbarMessage={this.props.setSnackbarMessage}
          title={title}
          toggleMark={toggleMark}
          type={type}
        />
        <div className={classes.message}>
          <Collapse in={selected} timeout={1000}>
            <Paper className={classes.expanderContent}>
              {messageContent.messages.map((message, index) => {
                const isLast = messageContent.length - 1 === index;
                return (
                  <Fragment key={index}>
                    <MessageItem message={message} key={message.ref} toggleMarkStatus={this.toggleMessageMarkStatus} />
                    {!isLast && <Divider variant="middle" key={index} />}
                  </Fragment>
                );
              })}
              {shouldDisplayLoadMoreButton && (
                <div className={classes.flexAlignCenter}>
                  <ButtonWithLoader
                    icon={<AddCircle />}
                    click={this.onLoadMoreButtonClick}
                    isLoading={loadingMore}
                    styles={{ margin: '12px', backgroundColor: 'white' }}
                  >
                    Load more
                  </ButtonWithLoader>
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
  }
}

const useStyles = () => ({
  expanderContent: {
    backgroundColor: 'beige',
    margin: '0 12px',
    marginBottom: '12px',
    overflow: 'hidden',
    color: 'rgba(100, 0, 0, 0.87)',
  },
  flexAlignCenter: {
    display: 'flex',
    justifyContent: 'center',
  },
});

export default withStyles(useStyles)(ThreadItem);
