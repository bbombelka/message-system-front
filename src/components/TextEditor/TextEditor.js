import React, { useState, useEffect } from 'react';
import ButtonWithLoader from '../ButtonWithLoader/ButtonWithLoader';
import { Button, Card, Collapse, Paper, TextField, Typography } from '@material-ui/core';
import { Add, Cancel, Remove, Send } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import { requestService, parseAxiosResponse, parseErrorResponse } from '../../../helpers/request.helper';
import bool from '../../../enums/bool.enum';

const useStyles = makeStyles({
  barCard: {
    display: 'flex',
    cursor: 'pointer',
  },
  button: {
    marginLeft: '12px',
    color: 'rgba(100, 0, 0, 0.87)',
    backgroundColor: 'white',
  },
  buttons: {
    display: 'flex',
    justifyContent: 'flex-end',
    paddingBottom: '12px',
  },
  expanderContent: {
    margin: '0 12px 12px',
    backgroundColor: 'beige',
  },
  iconColumn: {
    width: '72px',
    height: '72px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    color: 'rgba(100, 0, 0, 0.87)',
  },
  inputContainer: {
    width: '80%',
    margin: 'auto',
  },
  input: {
    '& .MuiOutlinedInput-root': {
      background: 'white',
      '&:hover fieldset': {
        borderColor: 'rgba(100,0,0,0.87)',
      },
      '&.Mui-focused fieldset': {
        borderColor: 'rgba(100,0,0,0.87)',
      },
    },
    margin: '24px 0',
  },
  header: {
    padding: '12px',
    lineHeight: '48px',
    fontWeight: 'bold',
  },
  paddingBottom: {
    paddingBottom: '12px',
  },
  root: {
    margin: '24px 0',
    position: 'sticky',
    top: 0,
    zIndex: 2,
  },
});

const TextEditor = (props) => {
  const {
    thread,
    setShowTextEditor,
    setSnackbarMessage,
    showTextEditor,
    onNewThreadStarted,
    onRepliedInThread,
  } = props;
  const [titleError, setTitleError] = useState(false);
  const [messageError, setMessageError] = useState(false);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [confirmState, setConfirmState] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isTitleInputTouched, setTitleInputTouched] = useState(false);
  const [isMessageInputTouched, setMessageInputTouched] = useState(false);

  const classes = useStyles();

  useEffect(() => {
    thread ? setTitle(thread.title) : setTitle('');
    setTitleInputTouched(false);
    setTitleError('');
    !showTextEditor && resetEditor();
  }, [showTextEditor, thread]);

  const makeRequest = async () => {
    const conditionalParams = thread ? { ref: thread.ref, reply: bool.TRUE } : { reply: bool.FALSE };
    const params = { ...conditionalParams, title, text: `<p>${message}</p>` };

    try {
      setIsLoading(true);
      const response = parseAxiosResponse(await requestService('sendmessage', params));
      onSuccessfulRequest(response);
    } catch (error) {
      const message = parseErrorResponse(error);
      setSnackbarMessage(message || 'Something went wrong on the way');
    } finally {
      setIsLoading(false);
    }
  };

  const onSuccessfulRequest = (response) => {
    thread ? onRepliedInThread(response.data, { ref: thread.ref }) : onNewThreadStarted(response);
    setSnackbarMessage('Your message has been sent.');
    setMessage('');
    !thread && setTitle('');
    setTitleInputTouched(false);
    setMessageInputTouched(false);
  };

  const onTitleInput = (e) => {
    validateTitleInput(e.target.value);
    setTitle(e.target.value);
  };

  const validateTitleInput = (inputValue) => {
    inputValue.length > 50 ? setTitleError('Message title can have 50 characters maximum.') : setTitleError('');
  };

  const onMessageInput = (e) => {
    validateMessageInput(e.target.value);
    setMessage(e.target.value);
  };

  const validateMessageInput = (inputValue) => {
    inputValue.length > 1000 ? setMessageError('Message body can have 1000 characters maximum.') : setMessageError('');
  };

  const onCancel = () => {
    const hasUnfinishedMessage = Boolean((title && isTitleInputTouched) || message);
    hasUnfinishedMessage ? onUnfinishedMessageClose() : setShowTextEditor(false);
  };

  const onUnfinishedMessageClose = () => {
    confirmState ? setShowTextEditor(false) : displayConfirmation();
  };

  const resetEditor = () => {
    setTitleError(false);
    setMessageError('');
    setTitle('');
    setMessage('');
    setConfirmState('');
    setTitleInputTouched(false);
    setMessageInputTouched(false);
  };

  const displayConfirmation = () => {
    setSnackbarMessage('Click again to confirm leaving the form. Your message will be lost.');
    setConfirmState(true);
  };

  const onBlur = () => {
    isTitleInputTouched && title.length < 4
      ? setTitleError('Title is too short. It should have at least 4 characters.')
      : setTitleError('');
    isMessageInputTouched && message.length < 21
      ? setMessageError('Message is too short. It should have at least 20 characters.')
      : setMessageError('');
  };

  const onBarClick = () => {
    showTextEditor ? onCancel() : setShowTextEditor((prevVal) => !prevVal);
  };

  const isSendButtonDisabled =
    Boolean(titleError || messageError) || isLoading || title.length < 4 || message.length < 21;

  const isTitleDisabled = Boolean(isLoading || thread);

  const headerText = thread ? 'Reply in this thread' : 'Start a new thread';

  const counterText =
    messageError === 'Message body can have 1000 characters maximum.'
      ? Math.abs(message.length - 1000) + ' excessive characters.'
      : 1000 - message.length + ' characters left.';

  return (
    <div className={classes.root}>
      <Card classes={{ root: classes.barCard }} onClick={onBarClick}>
        <div className={classes.iconColumn}>
          {showTextEditor ? (
            <Remove classes={{ root: classes.icon }} fontSize="large" />
          ) : (
            <Add classes={{ root: classes.icon }} fontSize="large" />
          )}
        </div>
        <Typography classes={{ root: classes.header }}>{headerText}</Typography>
      </Card>
      <Collapse in={showTextEditor}>
        <Paper classes={{ root: classes.paddingBottom }}>
          <Paper classes={{ root: classes.expanderContent }}>
            <div className={classes.inputContainer}>
              <TextField
                classes={{ root: classes.input }}
                disabled={isTitleDisabled}
                error={Boolean(titleError)}
                helperText={titleError}
                placeholder={'Type in message title. It will become thread title automatically...'}
                fullWidth
                onInput={onTitleInput}
                onBlur={onBlur}
                onFocus={() => setTitleInputTouched(true)}
                value={title}
                variant="outlined"
              />
            </div>
            <div className={classes.inputContainer}>
              <TextField
                classes={{ root: classes.input }}
                disabled={isLoading}
                error={Boolean(messageError)}
                helperText={messageError}
                placeholder={'Type in message body...'}
                rows={10}
                fullWidth
                multiline
                onFocus={() => setMessageInputTouched(true)}
                onBlur={onBlur}
                onInput={onMessageInput}
                value={message}
                variant="outlined"
              ></TextField>
              <div>
                <Typography variant="caption">{counterText} </Typography>
              </div>
              <div className={classes.buttons}>
                <div>
                  <Button
                    classes={{ root: classes.button }}
                    color="default"
                    disabled={isLoading}
                    onClick={onCancel}
                    endIcon={<Cancel />}
                    variant="outlined"
                  >
                    Cancel
                  </Button>
                </div>
                <div>
                  <ButtonWithLoader
                    click={makeRequest}
                    disabled={isSendButtonDisabled}
                    icon={<Send />}
                    isLoading={isLoading}
                    styles={{ margin: '0 0 0 12px', backgroundColor: 'beige' }}
                  >
                    Send
                  </ButtonWithLoader>
                </div>
              </div>
            </div>
          </Paper>
        </Paper>
      </Collapse>
    </div>
  );
};

export default TextEditor;
