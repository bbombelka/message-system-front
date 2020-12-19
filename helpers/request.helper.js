import axios from 'axios';
import { config } from '../config';
import { isFileObject } from '../helpers/common.helper';

const headers = {
  JSON: 'application/json',
};

export const prepareFormData = (params) => {
  const formData = new FormData();
  for (const key in params) {
    const currentValue = params[key];
    const hasFileContent = Array.isArray(currentValue) && currentValue.some((item) => isFileObject(item));

    hasFileContent ? currentValue.forEach((item) => formData.append(key, item)) : formData.append(key, params[key]);
  }
  return formData;
};

export const requestService = (service, requestParams, requestConfig) => {
  const token = localStorage.getItem('accessToken');

  return axios.post(config.SERVER_URL + service, requestParams, {
    headers: {
      Authorization: 'Bearer ' + token,
      'Content-Type': headers.JSON,
    },
  });
};

export const parseAxiosResponse = (response) => response.data;

export const parseErrorResponse = (error) => {
  if (error?.response?.data) {
    return error.response.data.msg;
  }
};

export const requestFileContent = async (service, requestParams) => {
  const token = localStorage.getItem('accessToken');

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
