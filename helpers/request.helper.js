import axios from 'axios';
import { config } from '../config';

const headers = {
  JSON: 'application/json',
};

export class RequestHelper {
  static getRequestFormData(data) {
    const formData = new FormData();
    data.forEach(({ key, value }) => formData.append(key, value));

    return formData;
  }
}

export const requestService = (service, requestParams, requestConfig) => {
  const token = localStorage.getItem('accessToken');

  return axios.post(config.SERVER_URL + service, requestParams, {
    headers: {
      Authorization: 'Bearer ' + token,
      'Content-Type': headers.JSON,
    },
    ...requestConfig,
  });
};

export const parseAxiosResponse = (response) => response.data;

export const parseErrorResponse = (error) => {
  if (error && error.response && error.response.data) {
    return error.response.data.msg;
  }
};

export const requestFileContent = async (service, requestParams) => {
  const token = localStorage.getItem('accessToken');

  const response = await fetch(config.SERVER_URL + service, {
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

  return response;
};
