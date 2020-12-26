import React, { Fragment, useContext } from 'react';
import { Card, Divider, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { AttachmentLink } from '../AttachmentLink/AttachmentLink';
import modeEnum from '../../../enums/mode.enum';
import { Cancel } from '@material-ui/icons';
import MainContext from '../MessagesMain/MessagesMainContext';

const AttachmentsArea = (props) => {
  const { attachments, margin, reference, remove } = props;
  const classes = useStyles({ margin });
  const { mode } = useContext(MainContext);

  const isFileUpload = mode === modeEnum.FILE_UPLOAD;
  const allAttachmentsLinkProps = {
    ref: reference,
    name: 'Download Zipped',
  };

  return (
    <Fragment>
      <Card className={classes.root}>
        <Typography className={classes.text}>Attachments to this message:</Typography>
        {attachments.map((attach, index) => (
          <AttachmentLink attachment={attach} mode={mode} key={index} remove={remove} />
        ))}
        {attachments.length > 1 && mode !== modeEnum.EDITION ? (
          <Fragment>
            <Divider variant="middle" />
            {isFileUpload ? (
              <Fragment>
                <Typography className={classes.text + ' ' + classes.allAttachment}>
                  Remove all attachments
                  <Cancel onClick={() => remove(null, { bulk: true })} className={classes.cancel}></Cancel>
                </Typography>
              </Fragment>
            ) : (
              <Fragment>
                <Typography className={classes.text + ' ' + classes.allAttachment}>
                  Download all attachments as ZIP file:
                </Typography>
                <AttachmentLink attachment={allAttachmentsLinkProps} />
              </Fragment>
            )}
          </Fragment>
        ) : (
          ''
        )}
      </Card>
    </Fragment>
  );
};

export default AttachmentsArea;

const useStyles = makeStyles({
  root: {
    margin: ({ margin }) => margin || '24px 12px 12px',
  },
  text: {
    padding: '12px',
    fontSize: '14px',
  },
  allAttachment: {
    display: 'inline-flex',
  },
  cancel: {
    color: 'rgba(100,0,0,0.87)',
    fontSize: '20px',
    cursor: 'pointer',
    paddingLeft: '4px',
  },
});
