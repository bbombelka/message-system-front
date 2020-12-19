import responseEnum from '../enums/response.enum';

export const isFileObject = (item) => item.constructor.name === 'File';

export const isString = (item) => typeof item === 'string';

export const extractServerErrorMessage = (response) => {
  if (isString(response)) {
    return response;
  }

  const erroneusUploads = response.filter(({ status }) => status === responseEnum.ERROR_RESPONSE);

  return erroneusUploads.length
    ? erroneusUploads.map((item) => item.msg.reduce((acc, curr) => acc + curr)).reduce((a, c) => a + c)
    : '';
};

export const extractServerSuccessfulMessage = (response) => {
  if (isString(response)) {
    return '';
  }

  const successfulUploads = response.filter(({ status }) => status === responseEnum.SUCCESSFUL_RESPONSE);
  const isMultiple = successfulUploads.length > 1;
  return successfulUploads.length
    ? successfulUploads.map(({ name }) => name).reduce((a, c) => a + ' ' + c, `${isMultiple ? 'Files' : 'file'}`) +
        ` ${isMultiple ? 'have' : 'has'} been successfuly uploaded.`
    : '';
};
