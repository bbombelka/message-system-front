import React, { Component } from 'react';
import LoginForm from './components/LoginForm';
import Container from '@material-ui/core/Container';

export class App extends Component {
  render() {
    return (
      <Container maxWidth="sm">
        <div>Message front System</div>
        <LoginForm />
      </Container>
    );
  }
}
