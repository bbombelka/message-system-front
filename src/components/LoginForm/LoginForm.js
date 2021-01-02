import axios from 'axios';
import { Avatar, Card, CardHeader } from '@material-ui/core';
import { Container, IconButton, OutlinedInput } from '@material-ui/core';
import { InputAdornment, InputLabel, FormControl, TextField } from '@material-ui/core';
import { config } from '../../../config';
import ButtonWithLoader from '../ButtonWithLoader/ButtonWithLoader';
import copyEnum from '../../../enums/copy.enum';
import Notification from '../Notification/Notification';
import errorsEnum from '../../../enums/errors.enum';
import React, { Component } from 'react';
import regexEnum from '../../../enums/regex.enum';
import { withRouter } from 'react-router';
import { Message, Visibility, VisibilityOff, VpnKey } from '@material-ui/icons/';
import { withStyles } from '@material-ui/core/styles';
import { requestService, getErrorMessageResponse, parseAxiosResponse } from '../../../helpers/request.helper';
import errorCodesEnum from '../../../enums/errorCodes.enum';

class LoginFormComponent extends Component {
  state = {
    isMakingRequest: false,
    loginTextFieldIsDisabled: false,
    loginButtonIsDisabled: true,
    oginErrorText: '',
    loginTextFieldValue: '',
    passwordError: '',
    passwordTextFieldIsDisabled: true,
    passwordTextFieldValue: '',
    requestNotificationMessage: '',
    showPassword: false,
    showRequestNotification: false,
  };

  componentDidMount = () => {
    if (sessionStorage.getItem('isLoggedIn')) {
      this.proceedToMessages();
    }
    if (this.props.history.location.state?.from === '/messages') {
      this.onLogout();
    }
  };

  onLogout = () => {
    this.props.history.replace({ pathname: '/', state: {} });
    setTimeout(() => this.props.toggleFullscreenLoader(), 500);
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
    this.setState({ loginErrorText: '' });
  };

  setLoginError = () => {
    this.setState({ loginErrorText: 'Invalid login format.' });
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
      const response = parseAxiosResponse(await requestService('login', data));
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
    this.persistWebStorageData(response.data);

    this.showNotification({ requestNotificationMessage: copyEnum.GENERIC_LOGIN_SUCCESS }, () => {
      this.setState({ loginTextFieldIsDisabled: true }, () => setTimeout(this.proceedToMessages, 500));
    });
  };

  persistWebStorageData = (tokens) => {
    const parseJwt = (token) => {
      try {
        return JSON.parse(atob(token.split('.')[1]));
      } catch (e) {
        return null;
      }
    };

    const { name } = parseJwt(tokens.accessToken);

    const items = {
      isLoggedIn: true,
      login: this.state.loginTextFieldValue,
      name,
    };

    Object.entries({ ...tokens, ...items }).forEach(([key, value]) => sessionStorage.setItem(key, value));
  };

  proceedToMessages = () => {
    this.props.toggleFullscreenLoader();
    this.props.history.push('/messages');
  };

  onErrorResponse = (error) => {
    const errorResponse = getErrorMessageResponse(error);
    const requestNotificationMessage = errorResponse || errorsEnum.GENERIC_LOGIN_ERROR;

    this.showNotification(
      {
        requestNotificationMessage,
        requestNotificationType: 'error',
      },
      this.resetForm
    );
  };

  showNotification = ({ requestNotificationMessage, requestNotificationType = 'success' }, callback = () => null) => {
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

    const { classes } = this.props;

    return (
      <Container maxWidth="sm">
        <Card>
          <CardHeader
            title="Welcome to Message System"
            avatar={
              <Avatar>
                <Message />
              </Avatar>
            }
          ></CardHeader>
          <form className={classes.loginForm}>
            <div className={classes.loginFormItem}>
              <TextField
                autoComplete="off"
                classes={{ root: classes.width }}
                id="login"
                disabled={loginTextFieldIsDisabled}
                error={Boolean(loginErrorText)}
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
            <div className={classes.loginFormItem}>
              <FormControl variant="outlined">
                <InputLabel htmlFor="password">Password</InputLabel>
                <OutlinedInput
                  classes={{ root: classes.width }}
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
            <div className={classes.loginNotification}>
              <Notification
                close={this.closeNotification}
                message={requestNotificationMessage}
                type={requestNotificationType}
                visible={showRequestNotification}
              />
            </div>
            <div className={classes.loginFormItem}>
              <ButtonWithLoader
                click={this.onLogInButtonClick}
                disabled={loginButtonIsDisabled}
                icon={<VpnKey />}
                isLoading={isMakingRequest}
                styles={{ margin: '0 0 0 12px', backgroundColor: 'beige' }}
              >
                Log in
              </ButtonWithLoader>
            </div>
          </form>
        </Card>
      </Container>
    );
  }
}

const useStyles = () => ({
  loginForm: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  loginFormItem: {
    display: 'flex',
    justifyContent: 'center',
    width: '75%',
    margin: '12px',
    position: 'relative',
  },
  width: {
    width: '250px',
  },
  loginNotification: {
    width: ' 75%',
  },
});

const LoginForm = withRouter(withStyles(useStyles)(LoginFormComponent));

export default LoginForm;
