import { config } from '../config';

export default {
  GENERIC_LOGIN_ERROR: 'Log in to message system failed. Try again.',
  GENERIC_REQ_ERROR: 'Something went wrong on the way.',
  GENERIC_LINK_TRY_AGAIN: 'Try again.',
  FILE_UNSUPPORTED: 'Files with that extension are not supported.',
  FILE_TOO_BIG: `This file exceeds maximum limit of ${config.MAX_FILE_SIZE} bytes per file.`,
  FILE_EXISTS: 'You have already attached file with that name.',
  TOO_MANY_FILES: `Maximum number of uploaded files is ${config.MAX_NUMBER_OF_ATTACHMENTS}`,
};
