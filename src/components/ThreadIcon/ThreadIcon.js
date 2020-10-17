import React from 'react';
import {
  ChatOutlined,
  CreateOutlined,
  InfoOutlined,
  WarningOutlined,
} from '@material-ui/icons';
import iconEnum from './threadIcon.enum';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  icon: {
    color: 'rgba(100,0,0,0.87)',
  },
});

const ThreadIcon = (props) => {
  const { type } = props;
  const classes = useStyles();

  const icons = {
    [iconEnum.INFO]: <InfoOutlined classes={{ root: classes.icon }} />,
    [iconEnum.WARNING]: <WarningOutlined classes={{ root: classes.icon }} />,
    [iconEnum.CHAT]: <ChatOutlined classes={{ root: classes.icon }} />,
    [iconEnum.SIGNATURE]: <CreateOutlined classes={{ root: classes.icon }} />,
  };

  return icons[type];
};

export default ThreadIcon;
