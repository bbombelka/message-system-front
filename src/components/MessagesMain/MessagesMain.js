import React, { useState, useRef, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import ThreadList from '../ThreadList/ThreadList';
import MainBar from '../MainBar/MainBar';
import MessageToolbar from '../MessageToolbar/MessageToolbar';
import TextEditor from '../TextEditor/TextEditor';
import { Container, Snackbar, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { errorHandler } from '../../../helpers/request.helper';
import bool from '../../../enums/bool.enum';
import MainContext from './MessagesMainContext';
import modeEnum from '../../../enums/mode.enum';
import styles from './styles';
import Services from '../../Services';

const MessagesMain = ({ toggleFullscreenLoader }) => {
  const classes = useStyle();
  const [displayMessageToolbar, setDisplayMessageToolbar] = useState(false);
  const [isMessage, setIsMessage] = useState(false);
  const [mode, setMode] = useState(modeEnum.INTERACTION);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [showTextEditor, setShowTextEditor] = useState(false);
  const [editedMessage, setEditedMessage] = useState(undefined);

  const threads = useRef(null);
  const messages = useRef(null);
  const history = useHistory();
  const location = useLocation();
  const isToolbarVertical = window.innerWidth > 1057;
  const markMode = mode === modeEnum.MARK_THREAD || mode === modeEnum.MARK_MESSAGE;
  // add resize listener

  useEffect(() => {
    const isThreadSelected = Boolean(threads.current.getSelectedThread());
    const setSource = () => {
      isThreadSelected ? setIsMessage(true) : setIsMessage(false);
    };

    const delay = displayMessageToolbar ? 0 : 500; // idea behind this is to delay button change. set to 10 and observe toolbar on message deselect
    setTimeout(() => setSource(), delay);
  }, [displayMessageToolbar]);

  useEffect(() => {
    !showTextEditor && setEditedMessage(undefined);
  }, [showTextEditor]);

  useEffect(() => {
    !editedMessage && setMode(modeEnum.INTERACTION);
  }, [editedMessage]);

  const logout = () => {
    const login = sessionStorage.getItem('login');

    toggleFullscreenLoader();
    sessionStorage.clear();

    Services.logout({ login });
    history.push('/', { from: location.pathname });
  };

  const toggleToolbar = (bool) => {
    if (markMode) return;

    if (bool !== undefined) {
      isMessage === false && setIsMessage(true);

      return setDisplayMessageToolbar(bool);
    }
    setDisplayMessageToolbar(!displayMessageToolbar);
  };

  const unMarkAll = () => {
    const options = ['', null, { mark: false }];
    mark(options);
  };

  const markAll = () => {
    const options = ['', null, { mark: true }];
    mark(options);
  };

  const mark = (options) => {
    isMessage ? messages.current.toggleMessageMarkStatus(...options) : threads.current.toggleMarkThread(...options);
  };

  const reloadItems = () => {
    isMessage ? messages.current.fetchErrorCallback() : threads.current.onNotificationClose();
  };

  const makeRequest = async (service) => {
    const isDeleteService = service === 'deleteitem';
    const getItemsRefsForRequest = (items) => {
      return items.filter(({ marked }) => marked).map(({ ref }) => ref);
    };

    const refsForRequest = isMessage
      ? getItemsRefsForRequest(messages.current.state.messageContent.messages)
      : getItemsRefsForRequest(threads.current.state.threads);

    if (!refsForRequest.length) {
      setSnackbarMessage(`Select at least one ${isMessage ? 'message' : 'thread'}`);
      return;
    }

    try {
      threads.current.props.toggleFullscreenLoader();
      const options = {
        ref: refsForRequest.join(','),
        bulk: refsForRequest.length > 1 ? bool.TRUE : bool.FALSE,
      };
      const { data } = await Services.makeRequest(service, options);

      isDeleteService
        ? removeItems(data.ref, data.total)
        : setSnackbarMessage("Selected threads have been sent to user's email address");
    } catch (error) {
      const options = {
        error,
        logout,
        repeatedCallbackParams: service,
        repeatedCallback: makeRequest,
        errorCallback: setSnackbarMessage,
        errorMessage: 'Something went wrong on the way',
      };
      errorHandler(options);
    } finally {
      threads.current.props.toggleFullscreenLoader();
    }
  };

  const removeItems = (ref, total) => {
    const deletedItemsRefs = ref.split(',');
    isMessage ? removeMessages(deletedItemsRefs, total) : removeThreads(deletedItemsRefs);
    displaySuccesfulDeletionSnackbar(deletedItemsRefs.length);
  };

  const removeMessages = (deletedItemsRefs, total) => {
    const threadRef = messages.current.state.threadRef;
    const currentMessages = messages.current.state.messageContent.messages;
    const messagesAfterDeletion = currentMessages.filter(({ ref }) => !deletedItemsRefs.includes(ref));
    const deleteCallback = () => {
      const shouldFetchMoreMessages = !messagesAfterDeletion.length && total;
      if (!total) {
        removeThreads([threadRef]);
        return setDisplayMessageToolbar(false);
      }
      if (shouldFetchMoreMessages) {
        messages.current.onLoadMoreButtonClick();
      }
      threads.current.setMessageNumber(threadRef, total);
    };

    messages.current.setState({ messageContent: { messages: messagesAfterDeletion, total } }, () => deleteCallback());
  };

  const removeThreads = (deletedItemsRefs) => {
    threads.current.setState({
      threads: threads.current.state.threads.filter(({ ref }) => !deletedItemsRefs.includes(ref)),
    });
  };

  const displaySuccesfulDeletionSnackbar = (numOfDeletedItems) => {
    const items = isMessage ? 'message(s)' : 'thread(s)';

    setSnackbarMessage(`${numOfDeletedItems} ${items} has been deleted.`);
  };

  const onNewThreadStarted = (response) => {
    threads.current.onSuccessfulThreadFetch(response, { isNewThread: true });
  };

  const onRepliedInThread = (data, { ref }) => {
    messages.current.onNewMessageAdded(data.messages);
    threads.current.setMessageNumber(ref, messages.current.state.messageContent.total + 1);
  };

  const editMessage = (ref) => {
    const editedMessage = messages.current.state.messageContent.messages.find((msg) => msg.ref === ref);
    setEditedMessage(editedMessage);
    setMode(modeEnum.EDITION);
    setShowTextEditor(true);
  };

  const onEditedMessage = (updatedMessage) => {
    const currentThreadMessages = messages.current.state.messageContent.messages;

    const editedMessage = {
      ...currentThreadMessages.find((msg) => msg.ref === updatedMessage.ref),
      lastUpdated: updatedMessage.lastUpdated,
      text: updatedMessage.text,
    };

    const editedMessageIndex = currentThreadMessages.findIndex((msg) => msg.ref === updatedMessage.ref);

    if (editedMessageIndex === -1) {
      throw new Error();
    }
    currentThreadMessages.splice(editedMessageIndex, 1, editedMessage);

    messages.current.setState({
      messageContent: { messages: currentThreadMessages, total: messages.current.state.messageContent.total },
    });
  };

  const selectedThread = isMessage ? threads.current.state.threads.find(({ selected }) => selected) : null;

  return (
    <div>
      <MainContext.Provider value={{ editMessage, logout, mode, setMode }}>
        <MainBar toggleToolbar={toggleToolbar} logout={logout} />
        <MessageToolbar
          displayed={displayMessageToolbar}
          vertical={isToolbarVertical}
          isMessage={isMessage}
          makeRequest={makeRequest}
          markAll={markAll}
          mode={mode}
          reloadItems={reloadItems}
          setMode={setMode}
          setShowTextEditor={setShowTextEditor}
          setSnackbarMessage={setSnackbarMessage}
          unMarkAll={unMarkAll}
        />
        <Container classes={{ root: classes.containerRoot }} maxWidth="md">
          <TextEditor
            logout={logout}
            mode={mode}
            onEditedMessage={onEditedMessage}
            editedMessage={editedMessage}
            onNewThreadStarted={onNewThreadStarted}
            onRepliedInThread={onRepliedInThread}
            showTextEditor={showTextEditor}
            setSnackbarMessage={setSnackbarMessage}
            setShowTextEditor={setShowTextEditor}
            thread={selectedThread}
          />
          <Typography variant="h2" className={classes.threadListHeader}>
            Your Current Messages
          </Typography>
          <ThreadList
            logout={logout}
            mode={mode}
            messageRef={messages}
            ref={threads}
            setSnackbarMessage={setSnackbarMessage}
            toggleFullscreenLoader={toggleFullscreenLoader}
            toggleToolbar={toggleToolbar}
          />
        </Container>
        <Snackbar
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          autoHideDuration={3000}
          classes={{ root: classes.snackbar }}
          onClose={() => setSnackbarMessage('')}
          open={Boolean(snackbarMessage)}
          key={'bottom' + 'center'}
        >
          <div>
            <Typography className={classes.snackbarContent}>{snackbarMessage}</Typography>
          </div>
        </Snackbar>
      </MainContext.Provider>
    </div>
  );
};

const useStyle = makeStyles(styles);

export default MessagesMain;
