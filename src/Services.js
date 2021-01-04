import { requestService, parseAxiosResponse } from '../helpers/request.helper';
import servicesEnum from '../enums/services.enum';

export default class Services {
  static makeRequest = async (service, params) => {
    return parseAxiosResponse(await requestService(service, params));
  };

  static getThreads = async (params) => {
    return this.makeRequest(servicesEnum.GET_THREADS, params);
  };

  static getMessages = async (params) => {
    return this.makeRequest(servicesEnum.GET_MESSAGES, params);
  };

  static deleteItem = async (params) => {
    return this.makeRequest(servicesEnum.DELETE_ITEM, params);
  };

  static sendMessage = async (params) => {
    return this.makeRequest(servicesEnum.SEND_MESSAGE, params);
  };

  static sendInEmail = async (params) => {
    return this.makeRequest(servicesEnum.SEND_IN_EMAIL, params);
  };

  static getAttachment = async (params) => {
    return this.makeRequest(servicesEnum.GET_ATTACHMENT, params);
  };

  static deleteAttachment = async (params) => {
    return this.makeRequest(servicesEnum.DELETE_ATTACHMENT, params);
  };

  static uploadAttachment = async (params) => {
    return this.makeRequest(servicesEnum.UPLOAD_ATTACHMENT, params);
  };

  static editMessage = async (params) => {
    return this.makeRequest(servicesEnum.EDIT_MESSAGE, params);
  };

  static login = async (params) => {
    return this.makeRequest(servicesEnum.LOGIN, params);
  };

  static logout = async (params) => {
    return this.makeRequest(servicesEnum.LOGOUT, params);
  };

  static renewToken = async (params) => {
    return this.makeRequest(servicesEnum.RENEW_TOKEN, params);
  };
}
