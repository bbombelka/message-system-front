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
    return response.data.threads.map(
      ({ ref, title, cd, date, nummess, unreadmess, type, read }) => {
        return {
          canBeDeleted: cd === boolEnum.TRUE,
          date: date,
          loading: false,
          messageNumber: nummess,
          messageContent: { messages: [], total: null },
          read: read === boolEnum.TRUE,
          ref,
          selected: false,
          title,
          type,
          unreadMessageNumber: unreadmess,
        };
      }
    );
  };

  parseMessageResponse = (response) => {
    return;
  };

  handleThreadSelection = (ref, params) => {
    const selectedThread = this.state.threads.find(({ selected }) => selected);

    if (!params && selectedThread && selectedThread.ref === ref) {
      return this.deselectThreads();
    }
    this.selectThread(ref, params);
  };

  deselectThreads = () => {
    const deselectedThreads = this.state.threads.map((thread) => {
      return { ...thread, selected: false };
    });

    this.setState({
      threads: deselectedThreads,
    });
  };

  selectThread = (ref, params) => {
    if (this.hasMessageContent(ref) && !params) {
      return this.setState({
        threads: this.state.threads.map((thread) => {
          return { ...thread, selected: thread.ref === ref };
        }),
      });
    }

    this.setState(
      {
        threads: this.state.threads.map((thread) => {
          return { ...thread, loading: thread.ref === ref };
        }),
      },
      () => this.fetchMessageData(ref, params)
    );
  };

  hasMessageContent = (ref) => {
    const { messageContent } = this.state.threads.find((thread) => thread.ref === ref);
    return messageContent.messages.length !== 0;
  };

  fetchMessageData = async (ref, params) => {
    const defaultParams = {
      ref,
      num: config.NUMBER_OF_FETCHED_MESSAGES,
      skip: 0,
    };

    const actualParams = { ...defaultParams, ...params };

    try {
      const response = parseAxiosResponse(await requestService('getmessages', actualParams));
      this.onSuccessfulMessageFetch(response.data, ref);
    } catch (error) {
      console.log(error);
    }
  };

  onSuccessfulMessageFetch = ({ messages, total }, ref) => {
    this.setState({
      threads: this.state.threads.map((thread) => {
        return {
          ...thread,
          selected: thread.ref === ref,
          loading: false,
          messageContent:
            thread.ref === ref
              ? { messages: [...thread.messageContent.messages, ...messages], total }
              : thread.messageContent,
        };
      }),
    });
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
        <ThreadItem thread={thread} key={thread.ref} select={this.handleThreadSelection} />
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
      />
    ) : (
      <Card>{!loading && threadList}</Card>
    );
  }
}

export default ThreadList;
