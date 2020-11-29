import React, { useState } from 'react';
import { IconButton, Toolbar, Tooltip } from '@material-ui/core';
import {
  AlternateEmail,
  CheckBox,
  CheckBoxOutlineBlank,
  Create,
  Delete,
  LibraryAddCheck,
  Replay,
  Reply,
} from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  root: {
    backgroundColor: 'rgba(100,0,0,0.87)',
    justifyContent: 'space-around',
    padding: 0,
    position: 'fixed',
    transition: 'all .2s ease-out',
    zIndex: 10,
  },
  button: {
    color: 'beige',
  },
  vertical: {
    left: '-48px',
    flexDirection: 'column',
    position: 'fixed',
    top: 'calc(50% - 96px)',
  },
  horizontal: {
    bottom: '-65px',
    width: '100vw',
    height: '56px',
  },
  verticalVisible: {
    left: 0,
  },
  horizontalVisible: {
    bottom: 0,
  },
  icon: {
    transition: '.2s box-shadow',
    boxShadow: ({ markMode }) => (markMode ? '0px 0px 5px 1px beige' : ''),
    borderRadius: 0,
  },
  markButtons: {
    display: 'flex',
    flexDirection: ({ vertical }) => (vertical ? 'column' : 'row'),
  },
  tooltip: {
    fontSize: '14px',
    backgroundColor: 'rgba(100,0,0,0.87)',
  },
});

const MessageToolbar = (props) => {
  const {
    displayed,
    isMessage,
    makeRequest,
    markAll,
    markMode,
    reloadItems,
    setMessageMarkMode,
    setShowTextEditor,
    setSnackbarMessage,
    setThreadMarkMode,
    unMarkAll,
    vertical,
  } = props;

  const classes = useStyles({ markMode, vertical });
  const [hasConfirmedDeletion, setHasConfirmedDeletion] = useState(false);
  const getToolbarClassName = () => {
    const orientation = vertical ? 'vertical' : 'horizontal';

    const toolbarClassName = classes.root
      .concat(` ${classes[orientation]}`)
      .concat(displayed ? ` ${classes[orientation + 'Visible']}` : '');

    return toolbarClassName;
  };

  const onMarkButtonClick = () => {
    isMessage ? setMessageMarkMode((prevVal) => !prevVal) : setThreadMarkMode((prevVal) => !prevVal);
    setHasConfirmedDeletion(false);
  };

  const getDeleteTooltipText = () => {
    const itemType = isMessage ? 'message(s)' : 'thread(s)';
    return markMode ? `Delete chosen ${itemType}` : `Choose ${itemType} to delete`;
  };

  const getEmailTooltipText = () => (markMode ? `Send chosen threads in email` : `Choose threads to send in email`);
  const getReplyCreateTooltipText = () => (isMessage ? 'Reply' : 'Start a new thread');
  const getReloadCreateTooltipText = () => (isMessage ? 'Reload messages' : 'Reload threads');
  const getMarkTooltipText = () => (markMode ? 'Switch off mark mode' : 'Switch on mark mode');

  const onDeleteClick = () => {
    markMode
      ? hasConfirmedDeletion
        ? performDeletion()
        : displayConfirmSnackBar()
      : isMessage
      ? setMessageMarkMode(true)
      : setThreadMarkMode(true);
  };

  const performDeletion = () => {
    makeRequest('deleteitem');
    setHasConfirmedDeletion(false);
  };

  const displayConfirmSnackBar = () => {
    setSnackbarMessage('Click delete icon again to confirm the deletion');
    setHasConfirmedDeletion(true);
  };

  const onEmailClick = () => {
    markMode ? makeRequest('sendinemail') : setThreadMarkMode(true);
  };

  const onReplyCreateClick = () => {
    setShowTextEditor((prevVal) => !prevVal);
  };

  const tooltipPlacement = vertical ? 'right' : 'top';

  return (
    <Toolbar className={getToolbarClassName()}>
      {!markMode && (
        <Tooltip
          classes={{ tooltip: classes.tooltip }}
          title={getReplyCreateTooltipText()}
          placement={tooltipPlacement}
        >
          <IconButton onClick={onReplyCreateClick} className={classes.button}>
            {isMessage ? <Reply /> : <Create />}
          </IconButton>
        </Tooltip>
      )}
      {!markMode && (
        <Tooltip
          classes={{ tooltip: classes.tooltip }}
          title={getReloadCreateTooltipText()}
          placement={tooltipPlacement}
        >
          <IconButton onClick={reloadItems} className={classes.button}>
            <Replay />
          </IconButton>
        </Tooltip>
      )}
      <Tooltip classes={{ tooltip: classes.tooltip }} title={getDeleteTooltipText()} placement={tooltipPlacement}>
        <IconButton onClick={onDeleteClick} className={classes.button}>
          <Delete />
        </IconButton>
      </Tooltip>

      {!isMessage && (
        <Tooltip classes={{ tooltip: classes.tooltip }} title={getEmailTooltipText()} placement={tooltipPlacement}>
          <IconButton onClick={onEmailClick} className={classes.button}>
            <AlternateEmail />
          </IconButton>
        </Tooltip>
      )}

      <div className={classes.markButtons}>
        <Tooltip classes={{ tooltip: classes.tooltip }} title={getMarkTooltipText()} placement={tooltipPlacement}>
          <IconButton onClick={onMarkButtonClick} classes={{ root: classes.icon }} className={classes.button}>
            <CheckBox />
          </IconButton>
        </Tooltip>
        {markMode && (
          <Tooltip classes={{ tooltip: classes.tooltip }} title="Unmark all" placement={tooltipPlacement}>
            <IconButton onClick={() => unMarkAll(isMessage)} className={classes.button}>
              <CheckBoxOutlineBlank />
            </IconButton>
          </Tooltip>
        )}
        {markMode && (
          <Tooltip classes={{ tooltip: classes.tooltip }} title="Mark all" placement={tooltipPlacement}>
            <IconButton onClick={() => markAll(isMessage)} className={classes.button}>
              <LibraryAddCheck />
            </IconButton>
          </Tooltip>
        )}
      </div>
    </Toolbar>
  );
};

export default MessageToolbar;
