import React from 'react';
import { Button, CircularProgress } from '@material-ui/core';
import { makeStyles, withStyles } from '@material-ui/core/styles';

const ButtonWithLoader = (props) => {
  const { click, disabled = false, icon, isLoading } = props;
  const classes = useStyles(props);

  return (
    <div className={classes.root}>
      <Button
        color="default"
        classes={{ root: classes.button }}
        disabled={disabled}
        onClick={click}
        endIcon={icon}
        variant="outlined"
      >
        {props.children}
        {isLoading && <StyledCircularProgress size={24} />}
      </Button>
    </div>
  );
};

const StyledCircularProgress = withStyles({
  root: { position: 'absolute', top: 'calc(50% - 12px)', left: 'calc(50% - 12px)' },
  colorPrimary: { color: 'rgba(100, 0, 0, 0.87)' },
})(CircularProgress);

const useStyles = makeStyles({
  button: {
    margin: ({ styles }) => styles?.margin || '0',
    color: 'rgba(100, 0, 0, 0.87)',
    backgroundColor: ({ styles }) => styles?.backgroundColor || 'inherit',
    position: 'relative',
  },
  root: {
    position: 'relative',
  },
});

export default ButtonWithLoader;
