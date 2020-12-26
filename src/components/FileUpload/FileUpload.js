import React, { useRef, useEffect, useContext } from 'react';
import ButtonWithLoader from '../ButtonWithLoader/ButtonWithLoader';
import { AttachFile } from '@material-ui/icons';
import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import AttachmentsArea from '../AttachmentsArea/AttachmentsArea';
import mimeTypeEnum from '../../../enums/mime-type.enum';
import { config } from '../../../config';
import errorsEnum from '../../../enums/errors.enum';
import { isFileObject } from '../../../helpers/common.helper';
import { usePrevious } from '../../../hooks/hooks';
import modeEnum from '../../../enums/mode.enum';
import MainContext from '../MessagesMain/MessagesMainContext';

export default function FileUpload(props) {
  const { files, setFiles, error, setError, removeAttachments } = props;
  const classes = useStyles();
  const fileInput = useRef();
  const previousFiles = usePrevious(files);
  const { setMode } = useContext(MainContext);

  useEffect(() => {
    if (previousFiles?.length > files.length) {
      setError('');
    }
    if (files.length === 0) {
      setMode(modeEnum.INTERACTION);
    }
  }, [files]);

  const onInput = () => {
    const { acceptedFiles = [], error = '' } = validateAttachments();
    setMode(modeEnum.FILE_UPLOAD);
    setError(error);
    setFiles((prevVal) => [...prevVal, ...acceptedFiles]);
  };

  const validateAttachments = () => {
    const isUnsupportedFileExtension = (mimetype) => ![...mimeTypeEnum.DOC, ...mimeTypeEnum.IMAGE].includes(mimetype);
    const isAboveMaxFilesize = (size) => size > config.MAX_FILE_SIZE;
    const filenameAlreadyExists = (name) => files.map((file) => file.name).includes(name);
    const hasTooManyFiles = (length, availableUploadFilesNumber) =>
      length > config.MAX_NUMBER_OF_ATTACHMENTS || length > availableUploadFilesNumber;

    const newAttachments = [...fileInput.current.files];
    const availableUploadFilesNumber = config.MAX_NUMBER_OF_ATTACHMENTS - files.length;

    if (hasTooManyFiles(newAttachments.length, availableUploadFilesNumber)) {
      return { error: errorsEnum.TOO_MANY_FILES };
    }

    const attachmentData = newAttachments.map(({ name, size, type }, index, arr) => {
      const possibleFileErrors = [
        filenameAlreadyExists(name) && errorsEnum.FILE_EXISTS,
        isAboveMaxFilesize(size) && errorsEnum.FILE_TOO_BIG,
        isUnsupportedFileExtension(type) && errorsEnum.FILE_UNSUPPORTED,
      ];

      const fileErrors = possibleFileErrors.filter((err) => err);

      return fileErrors.length ? fileErrors.reduce((acc, curr) => acc + ' ' + curr, `${name}: `) : arr[index];
    });

    return {
      acceptedFiles: attachmentData.filter((elem) => isFileObject(elem)),
      error: attachmentData.filter((elem) => !isFileObject(elem)).reduce((acc, curr) => acc + curr, ''),
    };
  };

  return (
    <div className={classes.root}>
      <div>
        <div>
          <Typography className={classes.caption} variant="caption">
            You can attach maximum 5 files to your message. Accepted formats are .bmp, .jpg, .png, .docx and .pdf.
            Maximum file size is 4 mb.
          </Typography>
        </div>
        <div className={classes.input}>
          <input ref={fileInput} onInput={onInput} id="contained-button-file" multiple type="file" />
          <label htmlFor="contained-button-file">
            <ButtonWithLoader component={'span'} icon={<AttachFile></AttachFile>} styles={{ backgroundColor: 'white' }}>
              Attach file(s)
            </ButtonWithLoader>
          </label>
        </div>
      </div>

      {files.length ? (
        <div>
          <AttachmentsArea attachments={files} margin={'12px 0'} remove={removeAttachments}></AttachmentsArea>
        </div>
      ) : (
        ''
      )}
      {error ? (
        <Typography className={classes.error} color="error" variant="caption" component="p">
          {error}
        </Typography>
      ) : (
        ''
      )}
    </div>
  );
}

const useStyles = makeStyles(() => ({
  root: {
    padding: '12px 0',
  },
  input: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: '12px',
    '& input': {
      display: 'none',
    },
  },
  error: {
    margin: '8px 0',
  },
}));
