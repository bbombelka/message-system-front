import React, { useState, useRef, useEffect } from 'react';
import ThreadList from '../ThreadList/ThreadList';
import MainBar from '../MainBar/MainBar';
import MessageToolbar from '../MessageToolbar/MessageToolbar';
import { Container } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles({
  containerRoot: {
    padding: '0',
  },
});

const MessagesMain = ({ toggleFullscreenLoader }) => {
  const classes = useStyles();
  const [displayMessageToolbar, setDisplayMessageToolbar] = useState(false);
  const [isMessage, setIsMessage] = useState(false);
  const [threadMarkMode, setThreadMarkMode] = useState(false);
  const [messageMarkMode, setMessageMarkMode] = useState(false);

  const threads = useRef(null);
  const messages = useRef(null);
  const isToolbarVertical = window.innerWidth > 1057;
  const markMode = threadMarkMode || messageMarkMode;
  // add resize listener

  useEffect(() => {
    const isThreadSelected = threads.current.state.threads.some((thread) => thread.selected);
    const setSource = () => {
      isThreadSelected ? setIsMessage(true) : setIsMessage(false);
    };

    const delay = displayMessageToolbar ? 0 : 500; // idea behind this is to delay button change. set to 10 and observe toolbar on message deselect
    setTimeout(() => setSource(), delay);
  }, [displayMessageToolbar]);

  const toggleToolbar = (bool) => {
    if (markMode) return;

    if (bool !== undefined) {
      isMessage === false && setIsMessage(true);

      return setDisplayMessageToolbar(bool);
    }
    setDisplayMessageToolbar(!displayMessageToolbar);
  };

  const toggleMarkMode = (bool) => {
    setThreadMarkMode(bool);
  };

  const unMarkAll = (isMessage) => {
    const options = ['', null, { mark: false }];
    isMessage ? messages.current.toggleMessageMarkStatus(...options) : threads.current.toggleMarkThread(...options);
  };

  const markAll = (isMessage) => {
    const options = ['', null, { mark: true }];
    isMessage ? messages.current.toggleMessageMarkStatus(...options) : threads.current.toggleMarkThread(...options);
  };

  return (
    <div>
      <MainBar toggleToolbar={toggleToolbar} />
      <MessageToolbar
        displayed={displayMessageToolbar}
        vertical={isToolbarVertical}
        isMessage={isMessage}
        markAll={markAll}
        markMode={markMode}
        setThreadMarkMode={toggleMarkMode}
        setMessageMarkMode={setMessageMarkMode}
        unMarkAll={unMarkAll}
      />
      <Container classes={{ root: classes.containerRoot }} maxWidth="md">
        <ThreadList
          ref={threads}
          toggleFullscreenLoader={toggleFullscreenLoader}
          toggleToolbar={toggleToolbar}
          threadMarkMode={threadMarkMode}
          messageMarkMode={messageMarkMode}
          messageRef={messages}
        />
      </Container>
    </div>
  );
};

export default MessagesMain;
