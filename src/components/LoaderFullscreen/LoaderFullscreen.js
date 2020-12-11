import React from 'react';
import { Backdrop, CircularProgress } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

export default function LoaderFullscreen({ open }) {
  const classes = useStyles();

  return (
    <Backdrop open={open} className={classes.backdrop}>
      <CircularProgress />
    </Backdrop>
  );
}

const useStyles = makeStyles(() => ({
  backdrop: {
    zIndex: 1,
    color: 'blue',
  },
}));
