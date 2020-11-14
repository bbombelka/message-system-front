import React, { Component } from 'react';
import { Card } from '@material-ui/core';
import boolEnum from '../../../enums/bool.enum';
import ThreadItem from '../ThreadItem/ThreadItem';
import { requestService, parseAxiosResponse } from '../../../helpers/request.helper';
import { config } from '../../../config';
import CustomNotification from '../CustomNotification/CustomNotification';
import errorsEnum from '../../../enums/errors.enum';
import iconEnum from '../Icon/Icon.enum';

class ThreadList extends Component {
  state = {
    threads: [],
    hasFetchError: false,
  };

  componentDidMount() {
    this.setState({ loading: true }, () => this.fetchThreadData());
  }

  fetchThreadData = async () => {
    const params = {
      num: config.NUMBER_OF_FETCHED_THREADS,
      skip: 0,
    };

    try {
      const response = parseAxiosResponse(await requestService('getthreads', params));
      this.onSuccessfulThreadFetch(response);
    } catch (error) {
      this.onFailedThreadFetch();
    }
  };

  onSuccessfulThreadFetch = (response) => {
    this.setState({ threads: this.parseResponse(response), loading: false }, () =>
      this.props.toggleFullscreenLoader({ showLoader: false })
    );
  };

  onFailedThreadFetch = () => {
    this.setState(
      {
        hasFetchError: true,
        fetchErrorMessage: errorsEnum.GENERIC_REQ_ERROR,
        errorLinkMessage: errorsEnum.GENERIC_LINK_TRY_AGAIN,
        errorNotificationCallback: () => this.onNotificationClose(),
        loading: false,
      },
      () => this.props.toggleFullscreenLoader({ showLoader: false }) // uncomment on combining with login form :-)
    );
  };

  onNotificationClose = () => {
    this.props.toggleFullscreenLoader({ showLoader: true });
    this.setState(
      {
        loading: true,
        hasFetchError: false,
        fetchErrorMessage: null,
        errorLinkMessage: null,
        errorNotificationCallback: null,
      },
      () => this.fetchThreadData()
    );
  };

  parseResponse = (response) => {
    return response.data.threads.map(({ ref, title, cd, date, nummess, unreadmess, type, read }) => {
      return {
        canBeDeleted: cd === boolEnum.TRUE,
        date: date,
        loading: false,
        marked: false,
        messageNumber: nummess,
        read: read === boolEnum.TRUE,
        ref,
        selected: false,
        title,
        type,
        unreadMessageNumber: unreadmess,
      };
    });
  };

  handleThreadSelection = (ref) => {
    const selectedThread = this.state.threads.find(({ selected }) => selected);

    if (selectedThread && selectedThread.ref === ref) {
      return this.deselectThreads();
    }
    this.selectThread(ref);
  };

  deselectThreads = () => {
    const deselectedThreads = this.state.threads.map((thread) => {
      return { ...thread, selected: false };
    });

    this.setState({ threads: deselectedThreads }, () => this.props.toggleToolbar(false));
  };

  selectThread = (ref, options = {}) => {
    this.setState(
      {
        threads: this.state.threads.map((thread) => {
          const selected = thread.ref === ref;
          const threadProps = selected ? options : {};
          return { ...thread, ...threadProps, selected };
        }),
      },
      () => this.props.toggleToolbar(true)
    );
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

  markAsRead = (ref) => {
    const options = { read: true };
    this.selectThread(ref, options);
  };

  render() {
    const {
      errorLinkMessage,
      errorNotificationCallback,
      fetchErrorMessage,
      hasFetchError,
      loading,
      threads,
    } = this.state;

    const threadList = threads.length ? (
      threads.map((thread) => (
        <ThreadItem
          key={thread.ref}
          markAsRead={this.markAsRead}
          messageMarkMode={this.props.messageMarkMode}
          ref={thread.selected && this.props.messageRef}
          select={this.handleThreadSelection}
          thread={thread}
          threadMarkMode={this.props.threadMarkMode}
          toggleMark={this.toggleMarkThread}
        />
      ))
    ) : (
      <CustomNotification
        linkCallback={() => console.log('log out man')} //could place common callbacks in separate module
        linkMessage={'Log out.'}
        message={'You have no messages'}
        type={iconEnum.INFO}
      />
    );

    return hasFetchError ? (
      <CustomNotification
        linkCallback={() => errorNotificationCallback()}
        linkMessage={errorLinkMessage}
        message={fetchErrorMessage}
        type={iconEnum.ERROR}
        backgroundColor={'white'}
      />
    ) : (
      <Card>{!loading && threadList}</Card>
    );
  }
}

export default ThreadList;
