import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import LoginForm from './components/LoginForm/LoginForm';
import LoaderFullscreen from './components/LoaderFullscreen/LoaderFullscreen';
import MessagesMain from './components/MessagesMain/MessagesMain';
import { makeStyles } from '@material-ui/core/styles';

export const App = () => {
  const [showLoader, setShowLoader] = useState(false);
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
          <Route path="/" render={() => <MessagesMain toggleFullscreenLoader={toggleFullscreenLoader} />} />
          <Route
            exact
            path="/s" // switch to "/" to start with login screen
            render={() => <LoginForm showFullscreenLoader={toggleFullscreenLoader} />}
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
