import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { AppBar, IconButton, Toolbar, Typography } from '@material-ui/core/';
import { ExitToApp, Mail } from '@material-ui/icons';
import styles from './styles';

const MainBar = ({ logout }) => {
  const classes = useStyles();
  const [userName] = useState(sessionStorage.getItem('name'));

  return (
    <div className={classes.grow}>
      <AppBar classes={{ root: classes.bordoBackground }} position="static">
        <Toolbar>
          <IconButton edge="start" className={classes.menuButton} color="inherit">
            <Mail />
          </IconButton>
          <Typography className={classes.title} variant="h6" noWrap>
            Hello {userName} !
          </Typography>
          <IconButton edge="end" classes={{ root: classes.logout }} onClick={logout} color="inherit">
            <ExitToApp />
          </IconButton>
        </Toolbar>
      </AppBar>
    </div>
  );
};

const useStyles = makeStyles(styles);

export default MainBar;
