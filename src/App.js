import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import LoginForm from './components/LoginForm/LoginForm';
import LoaderFullscreen from './components/LoaderFullscreen/LoaderFullscreen';
import MessagesMain from './components/MessagesMain/MessagesMain';
import { makeStyles } from '@material-ui/core/styles';

export const App = () => {
  const [showLoader, setShowLoader] = useState(false);
  const [isLoggedIn] = useState(JSON.parse(sessionStorage.getItem('isLoggedIn')));
  const [user, setUser] = useState(null);

  const classes = useStyles();
  const toggleFullscreenLoader = (options) => {
    const value = options ? options.showLoader : !showLoader;
    setShowLoader(value);
  };

  return (
    <div className={classes.root}>
      <Router>
        <LoaderFullscreen open={showLoader} />
        <Switch>
          <Route
            path="/messages"
            render={() => <MessagesMain user={user} toggleFullscreenLoader={toggleFullscreenLoader} />}
          />
          <Route
            exact
            path="/" // switch to "/" to start with login screen
            render={() => (
              <LoginForm setUser={setUser} isLoggedIn={isLoggedIn} toggleFullscreenLoader={toggleFullscreenLoader} />
            )}
          />
        </Switch>
      </Router>
    </div>
  );
};

const useStyles = makeStyles({
  root: {
    margin: 0,
    padding: 0,
    backgroundColor: 'beige',
  },
});
