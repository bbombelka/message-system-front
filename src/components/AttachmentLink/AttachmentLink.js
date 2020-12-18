import React, { useState, Fragment } from 'react';
import { Dialog, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Attachment, InsertDriveFile, Image } from '@material-ui/icons';
import mimeTypeEnum from '../../../enums/mime-type.enum';
import { requestFileContent } from '../../../helpers/request.helper';
import extension from '../../../mappers/file-extension.mapper';
import CustomNotification from '../CustomNotification/CustomNotification';
import styles from './styles';
import modeEnum from '../../../enums/mode.enum';
import { Cancel } from '@material-ui/icons';

const AttachmentLinkComponent = (props) => {
  const { name, size, mimetype, ref } = props.attachment;
  const { mode, remove } = props;
  const [downloadError, setDownloadError] = useState('');
  const classes = useStyles({ isFileUpload });
  const isFileUpload = mode === modeEnum.FILE_UPLOAD;

  const formatFileSize = (size) => (size / 1024).toFixed(2);

  const onLinkClick = (e) => {
    if (!isFileUpload) {
      e.preventDefault();
      downloadAttachmentFile();
    }
  };

  const onRemoveAttachmentClick = () => {
    remove(name);
  };

  const downloadAttachmentFile = async () => {
    try {
      const response = await requestFileContent('getattachment', { ref });
      performDownload(response);
    } catch (error) {
      setDownloadError(error.msg);
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
        <span className={classes.linkText}>{isFileUpload ? <span>{name}</span> : <a href="#">{name}</a>}</span>
        {size && <span className={classes.fileSize}>({formatFileSize(size)} Kb)</span>}
      </Typography>
      {isFileUpload ? <Cancel onClick={onRemoveAttachmentClick} className={classes.cancel}></Cancel> : ''}
      <Dialog open={Boolean(downloadError)}>
        <CustomNotification
          linkCallback={() => setDownloadError('')}
          linkMessage={'Close this window.'}
          message={downloadError}
          type={'E'}
        ></CustomNotification>
      </Dialog>
    </Fragment>
  );
};

const useStyles = makeStyles(styles);
export const AttachmentLink = React.memo(AttachmentLinkComponent);
