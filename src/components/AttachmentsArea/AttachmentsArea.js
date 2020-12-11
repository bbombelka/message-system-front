import React from 'react';
import { Card, Divider, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { AttachmentLink } from '../AttachmentLink/AttachmentLink';

const AttachmentsArea = ({ attachments, reference }) => {
  const styles = useStyles();
  const allAttachmentsLinkProps = {
    ref: reference,
    name: 'Download Zipped',
  };

  return (
    <React.Fragment>
      <Card className={styles.root}>
        <Typography className={styles.text}>Attachments to this message:</Typography>
        {attachments.map((attach, index) => (
          <AttachmentLink attachment={attach} key={index} />
        ))}
        {attachments.length > 1 && (
          <React.Fragment>
            <Divider variant="middle" />
            <Typography className={styles.text + ' ' + styles.allAttachment}>
              Download all attachments as ZIP file:
            </Typography>
            <AttachmentLink attachment={allAttachmentsLinkProps} />
          </React.Fragment>
        )}
      </Card>
    </React.Fragment>
  );
};

export default AttachmentsArea;

const useStyles = makeStyles({
  root: {
    margin: '24px 12px 12px',
  },
  text: {
    padding: '12px',
    fontSize: '14px',
  },
  allAttachment: {
    display: 'inline-block',
    padding: '8px',
  },
});
