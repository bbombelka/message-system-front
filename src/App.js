import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Container } from '@material-ui/core';
import LoginForm from './components/LoginForm/LoginForm';
import LoaderFullscreen from './components/LoaderFullscreen/LoaderFullscreen';
import MessagesMain from './components/MessagesMain/MessagesMain';
import './styles.css';

export class App extends Component {
  state = {
    showLoader: false,
  };

  toggleFullscreenLoader = (options) => {
    const showLoader = options ? options.showLoader : !this.state.showLoader;
    this.setState({
      showLoader,
    });
  };

  render() {
    return (
      <Container maxWidth="md">
        <Router>
          <LoaderFullscreen open={this.state.showLoader} />
          <Switch>
            <Route
              exact
              path="/s" // switch to "/" to start with login screen
              render={() => <LoginForm showFullscreenLoader={this.toggleFullscreenLoader} />}
            />
            <Route
              path="/"
              render={() => <MessagesMain toggleFullscreenLoader={this.toggleFullscreenLoader} />}
            />
          </Switch>
        </Router>
      </Container>
    );
  }
}
