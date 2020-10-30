import React, { useState, Fragment, useEffect } from 'react';
import { Dialog, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Attachment, InsertDriveFile, Image } from '@material-ui/icons';
import mimeTypeEnum from '../../../enums/mime-type.enum';
import { requestFileContent } from '../../../helpers/request.helper';
import extension from '../../../enums/file-extension.enum';
import CustomNotification from '../CustomNotification/CustomNotification';

const useStyles = makeStyles({
  root: {
    color: 'rgba(100,0,0,0.87)',
    display: 'inline-flex',
    margin: '8px',
    cursor: 'pointer',
  },
  fileSize: {
    fontSize: '10px',
    lineHeight: '28px',
    paddingLeft: '4px',
  },
  linkText: {
    fontSize: '12px',
    lineHeight: '25px',
    paddingLeft: '4px',
  },
});

export const AttachmentLink = (props) => {
  const { name, size, mimetype, ref } = props.attachment;
  const [downloadError, setDownloadError] = useState('');
  const styles = useStyles();
  const formatFileSize = (size) => (size / 1024).toFixed(2);

  const onClick = (e) => {
    e.preventDefault();
    downloadAttachmentFile();
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

  const linkIcon = mimetype ? (
    mimeTypeEnum.IMAGE.includes(mimetype) ? (
      <Image />
    ) : (
      <InsertDriveFile />
    )
  ) : (
    <Attachment />
  );

  return (
    <Fragment>
      <Typography className={styles.root} onClick={(e) => onClick(e)}>
        <span>{linkIcon}</span>
        <span className={styles.linkText}>
          <a href="#">{name}</a>
        </span>
        {size && <span className={styles.fileSize}>({formatFileSize(size)} Kb)</span>}
      </Typography>
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
