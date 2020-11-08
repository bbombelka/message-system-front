import axios from 'axios';
import { Avatar, Button, Card, CardHeader } from '@material-ui/core';
import { CircularProgress, Container, IconButton, OutlinedInput } from '@material-ui/core';
import { InputAdornment, InputLabel, FormControl, TextField } from '@material-ui/core';
import { config } from '../../../config';
import copyEnum from '../../../enums/copy.enum';
import Notification from '../Notification/Notification';
import errorsEnum from '../../../enums/errors.enum';
import React, { Component } from 'react';
import regexEnum from '../../../enums/regex.enum';
import { withRouter } from 'react-router';
import { withStyles } from '@material-ui/core/styles';
import { Message, Visibility, VisibilityOff, VpnKey } from '@material-ui/icons/';
import './styles.css';

class LoginFormComponent extends Component {
  state = {
    isMakingRequest: false,
    loginTextFieldIsDisabled: false,
    loginButtonIsDisabled: true,
    loginError: false,
    loginErrorText: '',
    loginTextFieldValue: '',
    passwordError: '',
    passwordTextFieldIsDisabled: true,
    passwordTextFieldValue: '',
    requestNotificationMessage: '',
    showPassword: false,
    showRequestNotification: false,
  };

  onChange = (stateProp) => (event) => {
    this.setState(
      {
        [stateProp]: event.target.value,
      },
      () => {
        stateProp === 'loginTextFieldValue' && this.validateLogin();
        stateProp === 'passwordTextFieldValue' && this.validatePassword();
      }
    );
  };

  validateLogin = () => {
    const { loginTextFieldValue } = this.state;

    if (loginTextFieldValue.length === config.LOGIN_LENGTH) {
      const isLoginValid = regexEnum.LOGIN_REGEX.test(loginTextFieldValue);
      isLoginValid ? this.onValidLogin() : this.setLoginError();
    } else {
      this.disablePasswordTextField();
    }
  };

  onValidLogin = () => {
    this.enablePasswordTextField();
    this.unsetLoginError();
  };

  enablePasswordTextField = () => {
    this.setState({ passwordTextFieldIsDisabled: false });
    this.validatePassword();
  };

  disablePasswordTextField = () => {
    this.setState({
      passwordTextFieldIsDisabled: true,
      loginButtonIsDisabled: true,
    });
  };

  unsetLoginError = () => {
    this.setState({
      loginError: false,
      loginErrorText: '',
    });
  };

  setLoginError = () => {
    this.setState({
      loginError: true,
      loginErrorText: 'Invalid login format.',
    });
  };

  onLoginBlur = () => {
    const { passwordTextFieldIsDisabled } = this.state;
    if (passwordTextFieldIsDisabled) {
      this.setLoginError();
    }
  };

  validatePassword = () => {
    const { passwordTextFieldValue } = this.state;
    this.setState({
      loginButtonIsDisabled: passwordTextFieldValue.length <= config.PASSWORD_MIN_LENGTH,
    });
  };

  onPasswordIconClick = () => {
    this.setState({
      showPassword: !this.state.showPassword,
    });
  };

  onLogInButtonClick = () => {
    const data = this.getFormData();
    this.setState(
      {
        isMakingRequest: true,
        loginButtonIsDisabled: true,
      },
      () => this.makeLoginRequest(data)
    );
  };

  getFormData = () => {
    const { loginTextFieldValue, passwordTextFieldValue } = this.state;
    const data = new FormData();

    data.append('login', loginTextFieldValue);
    data.append('pass', passwordTextFieldValue);

    return data;
  };

  makeLoginRequest = async (data) => {
    try {
      const response = await axios.post(config.SERVER_URL + 'login', data);
      this.onSuccessfulResponse(response);
    } catch (error) {
      this.onErrorResponse(error);
    }
  };

  resetForm = () => {
    this.setState({
      isMakingRequest: false,
      loginTextFieldValue: '',
      passwordTextFieldValue: '',
      passwordTextFieldIsDisabled: true,
    });
  };

  onSuccessfulResponse = (response) => {
    const requestNotificationMessage = copyEnum.GENERIC_LOGIN_SUCCESS;
    this.persistWebTokens(response.data.data);
    this.showNotification({ requestNotificationMessage }, () => {
      this.setState({ loginTextFieldIsDisabled: true }, () =>
        setTimeout(this.proceedToMessages, 500)
      );
    });
  };

  persistWebTokens = (tokens) => {
    Object.entries(tokens).forEach(([key, value]) => localStorage.setItem(key, value));
  };

  proceedToMessages = () => {
    this.props.showFullscreenLoader();
    this.props.history.push('/messages');
  };

  onErrorResponse = (error) => {
    const errorResponse = (error.response && error.response.data) || {};
    const requestNotificationMessage = errorResponse.msg || errorsEnum.GENERIC_LOGIN_ERROR;

    this.showNotification(
      {
        requestNotificationMessage,
        requestNotificationType: 'error',
      },
      this.resetForm
    );
  };

  showNotification = (
    { requestNotificationMessage, requestNotificationType = 'success' },
    callback = () => null
  ) => {
    this.setState(
      {
        requestNotificationMessage,
        requestNotificationType,
        showRequestNotification: true,
      },
      () => callback()
    );
  };

  closeNotification = () => {
    this.setState({
      showRequestNotification: false,
      requestNotificationMessage: '',
    });
  };

  render() {
    const {
      isMakingRequest,
      loginButtonIsDisabled,
      loginError,
      loginErrorText,
      loginTextFieldIsDisabled,
      loginTextFieldValue,
      passwordTextFieldValue,
      passwordTextFieldIsDisabled,
      requestNotificationMessage,
      requestNotificationType,
      showPassword,
      showRequestNotification,
    } = this.state;

    const StyledCircularProgress = withStyles({
      root: { position: 'absolute', top: '20%' },
    })(CircularProgress);

    return (
      <Container maxWidth="sm">
        {' '}
        //poziom wyżej comtainer z maxWidth md
        <Card>
          <CardHeader
            title="Welcome to Message System"
            avatar={
              <Avatar>
                <Message />
              </Avatar>
            }
          ></CardHeader>
          <form className="login-form">
            <div className="login-form-item">
              <TextField
                autoComplete="off"
                id="login"
                disabled={loginTextFieldIsDisabled}
                error={loginError}
                helperText={loginErrorText}
                label="Login"
                onBlur={this.onLoginBlur}
                onChange={this.onChange('loginTextFieldValue')}
                onFocus={this.closeNotification}
                placeholder="User login"
                required
                value={loginTextFieldValue}
                variant="outlined"
              />
            </div>
            <div className="login-form-item">
              <FormControl variant="outlined">
                <InputLabel htmlFor="password">Password</InputLabel>
                <OutlinedInput
                  labelWidth={70}
                  disabled={passwordTextFieldIsDisabled}
                  id="password"
                  onChange={this.onChange('passwordTextFieldValue')}
                  type={showPassword ? 'text' : 'password'}
                  value={passwordTextFieldValue}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        disabled={passwordTextFieldIsDisabled}
                        onClick={this.onPasswordIconClick}
                        onMouseDown={(e) => e.preventDefault()}
                      >
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  }
                />
              </FormControl>
            </div>
            <div className="login-notification">
              <Notification
                close={this.closeNotification}
                message={requestNotificationMessage}
                type={requestNotificationType}
                visible={showRequestNotification}
              />
            </div>
            <div className="login-form-item">
              <Button
                color="primary"
                disabled={loginButtonIsDisabled}
                onClick={this.onLogInButtonClick}
                startIcon={<VpnKey />}
                variant="contained"
              >
                Log in
              </Button>
              {isMakingRequest && <StyledCircularProgress size={24} />}
            </div>
          </form>
        </Card>
      </Container>
    );
  }
}

const LoginForm = withRouter(LoginFormComponent);

export default LoginForm;
