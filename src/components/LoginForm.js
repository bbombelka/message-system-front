import axios from 'axios';
import {
  Button,
  CircularProgress,
  IconButton,
  OutlinedInput,
  InputAdornment,
  InputLabel,
  FormControl,
  TextField,
} from '@material-ui/core';
import { config } from '../../config';
import ErrorNotification from './ErrorNotification';
import errorsEnum from '../../enums/errors.enum';
import React, { Component } from 'react';
import regexEnum from '../../enums/regex.enum';
import { Visibility, VisibilityOff, VpnKey } from '@material-ui/icons/';

export default class LoginForm extends Component {
  state = {
    isMakingRequest: false,
    loginButtonIsDisabled: true,
    loginError: false,
    loginErrorText: '',
    loginTextFieldValue: '',
    passwordError: '',
    passwordTextFieldIsDisabled: true,
    passwordTextFieldValue: '',
    requestErrorMessage: '',
    showPassword: false,
    showRequestError: false,
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
    this.setState({
      passwordTextFieldIsDisabled: false,
    });
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

    if (passwordTextFieldValue.length > 7) {
      this.setState({
        loginButtonIsDisabled: false,
      });
    } else {
      this.setState({
        loginButtonIsDisabled: true,
      });
    }
  };

  onPasswordIconClick = () => {
    this.setState({
      showPassword: !this.state.showPassword,
    });
  };

  onLogInButtonClick = () => {
    const data = this.getFormData();
    this.makeLoginRequest(data);
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
      this.setState({
        isMakingRequest: true,
        loginButtonIsDisabled: true,
      });
      const response = await axios.post(config.SERVER_URL + 'login', data);
    } catch (error) {
      this.onErrorResponse(error);
    }
  };

  onErrorResponse = (error) => {
    const errorResponse = error.response.data;
    this.setState({
      isMakingRequest: false,
      loginTextFieldValue: '',
      passwordTextFieldValue: '',
    });
    this.showErrorNotification(errorResponse);
  };

  showErrorNotification = (errorResponse = {}) => {
    const requestErrorMessage =
      errorResponse.msg || errorsEnum.GENERIC_LOGIN_ERROR;
    this.setState({ requestErrorMessage, showRequestError: true });
  };

  closeErrorNotification = () => {
    this.setState({
      showRequestError: false,
      requestErrorMessage: '',
    });
  };

  render() {
    const {
      isMakingRequest,
      loginButtonIsDisabled,
      loginError,
      loginErrorText,
      loginTextFieldValue,
      passwordTextFieldValue,
      passwordTextFieldIsDisabled,
      requestErrorMessage,
      showPassword,
      showRequestError,
    } = this.state;

    const styles = {
      buttonLoader: {
        position: 'absolute',
        marginTop: '-12px',
        marginLeft: '-12px',
        top: '50%',
        left: '50px',
      },
      wrapper: {
        position: 'relative',
      },
    };

    return (
      <form className="login-form">
        <div>
          <TextField
            autoComplete="off"
            id="login"
            error={loginError}
            helperText={loginErrorText}
            label="Login"
            onBlur={this.onLoginBlur}
            onChange={this.onChange('loginTextFieldValue')}
            onFocus={this.closeErrorNotification}
            placeholder="User login"
            required
            value={loginTextFieldValue}
            variant="outlined"
          />
        </div>
        <div>
          <FormControl>
            <InputLabel htmlFor="password">Password</InputLabel>
            <OutlinedInput
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
        <div style={styles.wrapper}>
          <Button
            color="primary"
            disabled={loginButtonIsDisabled}
            onClick={this.onLogInButtonClick}
            startIcon={<VpnKey />}
            variant="contained"
          >
            Log in
          </Button>
          {isMakingRequest && (
            <CircularProgress
              className={styles.buttonLoader}
              size={24}
              style={styles.buttonLoader}
            />
          )}
          <ErrorNotification
            close={this.closeErrorNotification}
            message={requestErrorMessage}
            visible={showRequestError}
          />
        </div>
      </form>
    );
  }
}
