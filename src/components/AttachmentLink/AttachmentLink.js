import React, { useState, Fragment, useContext } from 'react';
import { Dialog, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Attachment, InsertDriveFile, Image } from '@material-ui/icons';
import mimeTypeEnum from '../../../enums/mime-type.enum';
import { requestFileContent, errorHandler } from '../../../helpers/request.helper';
import extension from '../../../mappers/file-extension.mapper';
import CustomNotification from '../CustomNotification/CustomNotification';
import styles from './styles';
import modeEnum from '../../../enums/mode.enum';
import { Cancel } from '@material-ui/icons';
import MainContext from '../MessagesMain/MessagesMainContext';
import Services from '../../Services';

const AttachmentLinkComponent = (props) => {
  const { name, size, mimetype, ref } = props.attachment;
  const { isInsideMessage, mode, remove } = props;
  const [error, setError] = useState('');
  const [hasDisplayedConfirmation, setHasDisplayedConfirmation] = useState(false);
  const [isMakingRequest, setIsMakingRequest] = useState(false);
  const classes = useStyles({ isEditionOrUpload, isMakingRequest });
  const isEditionOrUpload = mode === modeEnum.FILE_UPLOAD || mode === modeEnum.EDITION;

  const { logout, removeAttachment, setSnackbarMessage } = useContext(MainContext);

  const formatFileSize = (size) => (size / 1024).toFixed(2);

  const onLinkClick = (e) => {
    if (!isEditionOrUpload) {
      e.preventDefault();
      downloadAttachmentFile();
    }
  };

  const onRemoveAttachmentClick = () => {
    mode === modeEnum.EDITION ? removeFromServer() : remove(name);
  };

  const removeFromServer = async () => {
    if (!hasDisplayedConfirmation) {
      setHasDisplayedConfirmation(true);
      return setSnackbarMessage('File will be irrevresibly removed from the message. Click remove again to continue.');
    }

    try {
      setIsMakingRequest(true);
      const response = await Services.deleteAttachment({ ref });
      const removedAttachmentRef = response.data.ref;
      if (removedAttachmentRef === ref) {
        remove(name);
        removeAttachment(ref);
      }
    } catch (error) {
      const options = {
        error,
        logout,
        repeatedCallback: removeFromServer,
        errorCallback: setError,
        errorMessage: 'Something went wrong on the way',
      };
      errorHandler(options);
    } finally {
      setIsMakingRequest(false);
    }
  };

  const downloadAttachmentFile = async () => {
    try {
      const response = await requestFileContent('getattachment', { ref });
      performDownload(response);
    } catch (error) {
      const options = {
        error,
        logout,
        repeatedCallback: downloadAttachmentFile,
        errorCallback: setError,
        errorMessage: 'Something went wrong on the way',
      };
      errorHandler(options);
    }
  };

  const performDownload = (response) => {
    const url = window.URL.createObjectURL(response);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${name}.${extension[response.type]}`);
    link.click();
  };

  const linkIcon = mimetype ? mimeTypeEnum.IMAGE.includes(mimetype) ? <Image /> : <InsertDriveFile /> : <Attachment />;

  return (
    <Fragment>
      <Typography className={classes.root} onClick={onLinkClick}>
        <span>{linkIcon}</span>
        <span className={classes.linkText}>
          {isEditionOrUpload && !isInsideMessage ? <span>{name}</span> : <a href="#">{name}</a>}
        </span>
        {Boolean(size) && <span className={classes.fileSize}>({formatFileSize(size)} Kb)</span>}
      </Typography>
      {isEditionOrUpload && !isInsideMessage ? (
        <Cancel onClick={onRemoveAttachmentClick} className={classes.cancel}></Cancel>
      ) : (
        ''
      )}
      <Dialog open={Boolean(error)}>
        <CustomNotification
          linkCallback={() => setError('')}
          linkMessage={'Close this window.'}
          message={error}
          type={'E'}
        ></CustomNotification>
      </Dialog>
    </Fragment>
  );
};

const useStyles = makeStyles(styles);
export const AttachmentLink = React.memo(AttachmentLinkComponent);
