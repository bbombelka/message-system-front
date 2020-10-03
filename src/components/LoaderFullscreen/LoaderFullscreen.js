import React from 'react';
import { Backdrop, CircularProgress } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  backdrop: {
    zIndex: 1,
    color: 'blue',
  },
}));

export default function LoaderFullscreen(props) {
  const classes = useStyles();
  const { open } = props;

  return (
    <Backdrop open={open} className={classes.backdrop}>
      <CircularProgress />
    </Backdrop>
  );
}
