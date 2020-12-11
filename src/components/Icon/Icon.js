import React from 'react';
import { ChatOutlined, CreateOutlined, ErrorOutlined, InfoOutlined, WarningOutlined } from '@material-ui/icons';
import iconEnum from './Icon.enum';
import { makeStyles } from '@material-ui/core/styles';

const Icon = (props) => {
  const { type, size = '24' } = props;
  const classes = useStyles({ type, size });

  switch (type) {
    case iconEnum.INFO:
      return <InfoOutlined classes={{ root: classes.icon }} />;
    case iconEnum.CHAT:
      return <ChatOutlined classes={{ root: classes.icon }} />;
    case iconEnum.SIGNATURE:
      return <CreateOutlined classes={{ root: classes.icon }} />;
    case iconEnum.ERROR:
      return <ErrorOutlined classes={{ root: classes.icon }} />;
    default:
      return <InfoOutlined classes={{ root: classes.icon }} />;
  }
};

const useStyles = makeStyles({
  icon: {
    color: 'rgba(100,0,0,0.87)',
    fontSize: (props) => props.size + 'px',
  },
});

export default Icon;
