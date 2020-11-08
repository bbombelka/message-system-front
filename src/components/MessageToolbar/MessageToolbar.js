import React from 'react';
import { IconButton, Toolbar } from '@material-ui/core';
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
    position: 'fixed',
    padding: 0,
    transition: 'all .2s ease-out',
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
});

const MessageToolbar = (props) => {
  const {
    displayed,
    isMessage,
    markAll,
    markMode,
    setMessageMarkMode,
    setThreadMarkMode,
    unMarkAll,
    vertical,
  } = props;

  const classes = useStyles({ markMode });

  const getToolbarClassName = () => {
    const orientation = vertical ? 'vertical' : 'horizontal';

    const toolbarClassName = classes.root
      .concat(` ${classes[orientation]}`)
      .concat(displayed ? ` ${classes[orientation + 'Visible']}` : '');

    return toolbarClassName;
  };

  // const markIconClass = classes.icon.concat(markMode ? ` ${classes.iconSelected}` : ``);

  const onMarkButtonClick = () => {
    isMessage
      ? setMessageMarkMode((prevVal) => !prevVal)
      : setThreadMarkMode((prevVal) => !prevVal);
  };

  return (
    <Toolbar className={getToolbarClassName()}>
      {!markMode && (
        <IconButton className={classes.button}>{isMessage ? <Reply /> : <Create />}</IconButton>
      )}

      <IconButton className={classes.button}>
        <Delete />
      </IconButton>
      {!isMessage && (
        <IconButton className={classes.button}>
          <AlternateEmail />
        </IconButton>
      )}
      {!markMode && (
        <IconButton className={classes.button}>
          <Replay />
        </IconButton>
      )}
      <IconButton
        onClick={onMarkButtonClick}
        classes={{ root: classes.icon }}
        className={classes.button}
      >
        <CheckBox />
      </IconButton>
      {markMode && (
        <IconButton onClick={() => unMarkAll(isMessage)} className={classes.button}>
          <CheckBoxOutlineBlank />
        </IconButton>
      )}
      {markMode && (
        <IconButton onClick={() => markAll(isMessage)} className={classes.button}>
          <LibraryAddCheck />
        </IconButton>
      )}
    </Toolbar>
  );
};

export default MessageToolbar;
