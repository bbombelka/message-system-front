import React from 'react';
import { Backdrop, CircularProgress } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

export default function LoaderFullscreen({ open }) {
  const classes = useStyles();

  return (
    <Backdrop open={open} className={classes.backdrop}>
      <CircularProgress color="inherit" />
    </Backdrop>
  );
}

const useStyles = makeStyles(() => ({
  backdrop: {
    zIndex: 3,
    color: 'rgba(100,0,0,0.87)',
  },
}));
