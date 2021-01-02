import axios from 'axios';
import { config } from '../config';
import { isFileObject } from '../helpers/common.helper';
import errorCodesEnum from '../enums/errorCodes.enum';
import { useHistory } from 'react-router-dom';

const headers = {
  JSON: 'application/json',
};

const unprotectedRoutes = ['login', 'logout', 'renewtoken'];

export const prepareFormData = (params) => {
  const formData = new FormData();
  for (const key in params) {
    const currentValue = params[key];
    const hasFileContent = Array.isArray(currentValue) && currentValue.some((item) => isFileObject(item));
    hasFileContent ? currentValue.forEach((item) => formData.append(key, item)) : formData.append(key, currentValue);
  }

  return formData;
};

export const requestService = (service, requestParams) => {
  const requestConfig = unprotectedRoutes.includes(service)
    ? {}
    : {
        headers: {
          Authorization: 'Bearer ' + sessionStorage.getItem('accessToken'),
          'Content-Type': headers.JSON,
        },
      };

  return axios.post(config.SERVER_URL + service, requestParams, requestConfig);
};

export const parseAxiosResponse = (response) => response.data;

export const getErrorMessageResponse = (error) => {
  return error?.response?.data?.msg;
};

export const getErrorCode = (error) => {
  return error?.response?.data?.code;
};

export const errorHandler = async (options) => {
  const { error, repeatedCallback, repeatedCallbackParams, errorCallback, errorMessage = null } = options;
  const errorCode = getErrorCode(error) || error.code;

  if (errorCode === errorCodesEnum.EXPIRED_ACCESS_TOKEN) {
    try {
      await renewToken();
      return repeatedCallback(repeatedCallbackParams);
    } catch (err) {
      if (err.message === errorCodesEnum.EXPIRED_REFRESH_TOKEN) {
        sessionStorage.clear();
        return console.log('token is not longer valid log out');
      }
    }
  }

  const errorCallbackParams = errorMessage ? getErrorMessageResponse(error) || error.msg : errorMessage;

  errorCallback(errorCallbackParams);
};

export const requestFileContent = async (service, requestParams) => {
  const token = sessionStorage.getItem('accessToken');

  return fetch(config.SERVER_URL + service, {
    method: 'POST',
    body: JSON.stringify(requestParams),
    headers: {
      Authorization: 'Bearer ' + token,
      'Content-Type': headers.JSON,
    },
  }).then((res) => {
    const header = res.headers.get('content-type');
    const isJsonResponse = header.substring(0, 16) === headers.JSON;

    return new Promise(async (resolve, reject) => {
      if (isJsonResponse) {
        return reject(await res.json());
      }
      resolve(await res.blob());
    });
  });
};

const renewToken = async () => {
  try {
    const { data } = parseAxiosResponse(
      await requestService('renewToken', { token: sessionStorage.getItem('refreshToken') })
    );
    sessionStorage.setItem('accessToken', data.accessToken);
  } catch (error) {
    throw new Error(getErrorCode(error));
  }
};
