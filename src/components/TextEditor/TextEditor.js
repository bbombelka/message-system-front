import React, { useState, useEffect, Fragment } from 'react';
import ButtonWithLoader from '../ButtonWithLoader/ButtonWithLoader';
import { Button, Card, Collapse, Divider, Paper, TextField, Typography } from '@material-ui/core';
import { Add, Cancel, Remove, Send } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import {
  requestService,
  parseAxiosResponse,
  parseErrorResponse,
  prepareFormData,
} from '../../../helpers/request.helper';
import bool from '../../../enums/bool.enum';
import styles from './styles';
import FileUpload from '../FileUpload/FileUpload';
import { extractServerErrorMessage, extractServerSuccessfulMessage } from '../../../helpers/common.helper';
import modeEnum from '../../../enums/mode.enum';
import AttachmentsArea from '../AttachmentsArea/AttachmentsArea';

const TextEditor = (props) => {
  const {
    mode,
    thread,
    setShowTextEditor,
    setSnackbarMessage,
    showTextEditor,
    onNewThreadStarted,
    onRepliedInThread,
    editedMessage,
    onEditedMessage,
  } = props;
  const [titleError, setTitleError] = useState(false);
  const [messageError, setMessageError] = useState(false);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [confirmState, setConfirmState] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isTitleInputTouched, setTitleInputTouched] = useState(false);
  const [isMessageInputTouched, setMessageInputTouched] = useState(false);
  const [attachments, setAttachments] = useState([]);
  const [attachmentError, setAttachmentError] = useState('');

  const classes = useStyles();

  useEffect(() => {
    thread ? setTitle(thread.title) : setTitle('');
    setTitleInputTouched(false);
    setTitleError('');
    !showTextEditor && resetEditor();
  }, [showTextEditor, thread]);

  useEffect(() => {
    if (editedMessage) {
      setTitle(editedMessage.title);
      setMessage(editedMessage.text);
      setAttachments(editedMessage.attachments);
    }
  }, [editedMessage]);

  const makeRequest = async () => {
    const { params, service } = getRequestParams();

    try {
      setIsLoading(true);
      const response = parseAxiosResponse(await requestService(service, params));

      if (editedMessage) {
        return onSuccessfulEditRequest(response.data);
      }

      const uploadFileResponse = attachments.length ? await uploadFiles(response) : '';
      const [errorMessage = '', successMessage = ''] = getServerMessages(uploadFileResponse);

      onSuccessfulSendRequest(response, { errorMessage, successMessage });
    } catch (error) {
      const message = parseErrorResponse(error);
      setSnackbarMessage(message || 'Something went wrong on the way');
    } finally {
      setIsLoading(false);
    }
  };

  const uploadFiles = async (response) => {
    try {
      const ref = response.data.messages[0].ref;
      const params = prepareFormData({ ref: ref, file: attachments });

      return parseAxiosResponse(await requestService('uploadattachment', params)).data;
    } catch (error) {
      return parseErrorResponse(error);
    }
  };

  const getServerMessages = (response) => {
    const errorMessage = extractServerErrorMessage(response);
    const successMessage = extractServerSuccessfulMessage(response);

    return [errorMessage, successMessage];
  };

  const getRequestParams = () => {
    const getWrapper = (params, service) => ({ params, service });

    if (editedMessage) {
      return getWrapper({ ref: editedMessage.ref, text: message }, 'editmessage');
    }
    const conditionalParams = thread ? { ref: thread.ref, reply: bool.TRUE } : { reply: bool.FALSE };
    return getWrapper({ ...conditionalParams, title, text: `<p>${message}</p>` }, 'sendmessage');
  };

  const onSuccessfulEditRequest = (data) => {
    const updatedMessage = data.messages.pop();
    onEditedMessage(updatedMessage);
    setShowTextEditor(false);
    setSnackbarMessage('Your message has been successfuly edited.');
  };

  const onSuccessfulSendRequest = (response, { errorMessage, successMessage }) => {
    thread ? onRepliedInThread(response.data, { ref: thread.ref }) : onNewThreadStarted(response);
    const snackbarMessage = `Your message has been sent. ${successMessage} ${
      errorMessage ? 'There were problem with some uploaded files.' : ''
    }`;
    setSnackbarMessage(snackbarMessage);
    if (errorMessage) {
      setAttachmentError(errorMessage);
      return setMessage('');
    }
    setShowTextEditor(false);
  };

  const removeAttachments = (name, options = {}) => {
    const { bulk } = options;

    if (bulk) {
      return setAttachments([]);
    }

    setAttachments(attachments.filter((attachment) => attachment.name !== name));
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
    const hasUnfinishedMessage = Boolean((title && isTitleInputTouched) || message || attachments.length);
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
    setAttachments([]);
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

  const headerText = editedMessage ? 'Edit message' : thread ? 'Reply in this thread' : 'Start a new thread';

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
              <Divider></Divider>
              {mode === modeEnum.EDITION ? (
                attachments.length ? (
                  <Fragment>
                    <div>
                      <AttachmentsArea
                        attachments={attachments}
                        margin={'12px 0'}
                        remove={removeAttachments}
                      ></AttachmentsArea>
                    </div>
                    <Divider></Divider>
                  </Fragment>
                ) : (
                  ''
                )
              ) : (
                <Fragment>
                  <div>
                    <FileUpload
                      removeAttachments={removeAttachments}
                      files={attachments}
                      setFiles={setAttachments}
                      error={attachmentError}
                      setError={setAttachmentError}
                    ></FileUpload>
                  </div>
                  <Divider></Divider>
                </Fragment>
              )}
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

const useStyles = makeStyles(styles);

export default TextEditor;
