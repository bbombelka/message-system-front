import React, { useState } from 'react';
import ButtonWithLoader from '../ButtonWithLoader/ButtonWithLoader';
import { Button, Card, TextField, Typography } from '@material-ui/core';
import { Cancel, Send } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import { requestService, parseAxiosResponse, parseErrorResponse } from '../../../helpers/request.helper';
import bool from '../../../enums/bool.enum';

const useStyles = makeStyles({
  button: {
    marginLeft: '12px',
    color: 'rgba(100, 0, 0, 0.87)',
    backgroundColor: 'beige',
  },
  buttons: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  inputContainer: {
    width: '80%',
    margin: 'auto',
  },
  input: {
    '& .MuiOutlinedInput-root': {
      '&:hover fieldset': {
        borderColor: 'inherit',
      },
      '&.Mui-focused fieldset': {
        borderColor: 'rgba(100,0,0,0.87)',
      },
    },
    margin: '24px 0',
  },
  root: {
    margin: '24px 0',
    padding: '24px',
    position: 'sticky',
    top: 0,
    zIndex: 2,
  },
});

const TextEditor = (props) => {
  const { thread, setShowTextEditor, setSnackbarMessage, onNewThreadStarted, onRepliedInThread } = props;
  const [titleError, setTitleError] = useState(false);
  const [messageError, setMessageError] = useState(false);
  const [title, setTitle] = useState(thread?.title || '');
  const [message, setMessage] = useState('');
  const [confirmState, setConfirmState] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isTitleInputTouched, setTitleInputTouched] = useState(false);
  const [isMessageInputTouched, setMessageInputTouched] = useState(false);

  const classes = useStyles();

  const onTitleInput = (e) => {
    const { value } = e.target;
    validateInput(value);
    setTitle(value);
  };

  const validateInput = (inputValue) => {
    inputValue.length > 50 ? setTitleError('Message title can have 50 characters maximum.') : setTitleError('');
  };

  const onMessageInput = (e) => {
    const { value } = e.target;
    validateMessageInput(value);
    setMessage(value);
  };

  const validateMessageInput = (inputValue) => {
    inputValue.length > 1000 ? setMessageError('Message body can have 1000 characters maximum.') : setMessageError('');
  };

  const counterText =
    messageError === 'Message body can have 1000 characters maximum.'
      ? Math.abs(message.length - 1000) + ' excessive characters.'
      : 1000 - message.length + ' characters left.';

  const onCancelButtonClick = () => {
    const hasUnfinishedMessage = Boolean(title || message);
    hasUnfinishedMessage ? onUnfinishedMessageClose() : setShowTextEditor(false);
  };

  const onUnfinishedMessageClose = () => {
    confirmState ? setShowTextEditor(false) : displayConfirmation();
  };

  const displayConfirmation = () => {
    setSnackbarMessage('Click cancel again to confirm leaving the form. Your message will be lost.');
    setConfirmState(true);
  };

  const onSendButtonClick = (e) => {
    makeRequest();
  };

  const onBlur = () => {
    isTitleInputTouched && title.length < 4
      ? setTitleError('Title is too short. It should have at least 4 characters.')
      : setTitleError('');
    isMessageInputTouched && message.length < 21
      ? setMessageError('Message is too short. It should have at least 20 characters.')
      : setMessageError('');
  };

  const makeRequest = async () => {
    const conditionalParams = thread ? { ref: thread.ref, reply: bool.TRUE } : { reply: bool.FALSE };
    const params = { ...conditionalParams, title, text: message };

    try {
      setIsLoading(true);
      const response = parseAxiosResponse(await requestService('sendmessage', params));
      onSuccessfulRequest(response);
    } catch (error) {
      console.log(error);
      const message = parseErrorResponse(error);
      setSnackbarMessage(message || 'Something went wrong on the way');
    } finally {
      setIsLoading(false);
    }
  };

  const onSuccessfulRequest = (response) => {
    thread ? onRepliedInThread(response.data) : onNewThreadStarted(response);
    setSnackbarMessage('Your message has been sent.');
    setMessage('');
    !thread && setTitle('');
    setTitleInputTouched(false);
    setMessageInputTouched(false);
  };

  const isSendButtonDisabled =
    Boolean(titleError || messageError) || isLoading || title.length < 4 || message.length < 21;

  const isTitleDisabled = Boolean(isLoading || thread);

  const headerText = thread ? 'Reply in this thread' : 'Start a new thread';
  return (
    <Card classes={{ root: classes.root }}>
      <Typography variant="h5">{headerText}</Typography>
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
              onClick={onCancelButtonClick}
              endIcon={<Cancel />}
              variant="outlined"
            >
              Cancel
            </Button>
          </div>
          <div>
            <ButtonWithLoader
              click={onSendButtonClick}
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
    </Card>
  );
};

export default TextEditor;
