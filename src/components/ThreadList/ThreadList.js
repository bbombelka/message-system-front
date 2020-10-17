import React, { Component } from 'react';
import { Card } from '@material-ui/core';
import boolEnum from '../../../enums/bool.enum';
import ThreadItem from '../ThreadItem/ThreadItem';
import { requestService, parseAxiosResponse } from '../../../helpers/request.helper';
import { config } from '../../../config';

class ThreadList extends Component {
  state = {
    threads: [],
  };

  componentDidMount() {
    this.fetchThreadData();
  }

  fetchThreadData = async () => {
    const params = {
      num: config.NUMBER_OF_FETCHED_THREADS,
      skip: 0,
    };

    try {
      const response = parseAxiosResponse(await requestService('getthreads', params));

      this.setState({ threads: this.parseResponse(response) });
    } catch (error) {}
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
    if (this.hasFullMessageContent(ref)) {
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

  hasFullMessageContent = (ref) => {
    const { messageContent } = this.state.threads.find((thread) => thread.ref === ref);
    return messageContent.messages.length === messageContent.total;
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
    const { threads } = this.state;

    const threadList = threads.length ? (
      threads.map((thread) => (
        <ThreadItem thread={thread} key={thread.ref} select={this.handleThreadSelection} />
      ))
    ) : (
      <div> masz zsero wiadomosci</div>
    );

    return <Card>{threadList}</Card>;
  }
}

export default ThreadList;
