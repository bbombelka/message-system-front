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
import {
  requestService,
  getErrorMessageResponse,
  parseAxiosResponse,
  prepareFormData,
} from '../../../helpers/request.helper';
import styles from './styles';

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
    this.setState(
      {
        isMakingRequest: true,
        loginButtonIsDisabled: true,
      },
      () => this.makeLoginRequest()
    );
  };

  makeLoginRequest = async () => {
    const { loginTextFieldValue, passwordTextFieldValue } = this.state;
    const params = prepareFormData({ login: loginTextFieldValue, pass: passwordTextFieldValue });

    try {
      const response = parseAxiosResponse(await requestService('login', params));
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
    const avatarClass = classes.avatar.concat(
      isMakingRequest || showRequestNotification ? ' ' + classes.avatarBackground : ''
    );

    return (
      <Container classes={{ root: classes.root }} maxWidth="sm">
        <Card>
          <CardHeader
            classes={{ title: classes.header }}
            title="Welcome to Message System"
            avatar={
              <Avatar classes={{ root: avatarClass }}>
                <Message />
              </Avatar>
            }
          ></CardHeader>
          <form className={classes.loginForm}>
            <div className={classes.loginFormItem}>
              <TextField
                autoComplete="off"
                classes={{ root: classes.input }}
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
            <div>
              <FormControl classes={{ root: classes.input }} variant="outlined">
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

const useStyles = () => styles;

const LoginForm = withRouter(withStyles(useStyles)(LoginFormComponent));

export default LoginForm;
