import React, { Component } from 'react';
import LoginForm from './components/LoginForm/LoginForm';
import Container from '@material-ui/core/Container';
import './styles.css';

export class App extends Component {
  render() {
    return (
      <Container maxWidth="md">
        <LoginForm />
      </Container>
    );
  }
}
