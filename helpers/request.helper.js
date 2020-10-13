import axios from 'axios';
import { config } from '../config';

export class RequestHelper {
  static getRequestFormData(data) {
    const formData = new FormData();
    data.forEach(({ key, value }) => formData.append(key, value));

    return formData;
  }
}

export const requestService = (service, requestParams) => {
  const token = localStorage.getItem('accessToken');

  return axios.post(config.SERVER_URL + service, requestParams, {
    headers: {
      Authorization: 'Bearer ' + token,
      'Content-Type': 'application/json',
    },
  });
};

export const parseAxiosResponse = (response) => response.data;
