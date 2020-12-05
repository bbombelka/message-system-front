import React from 'react';
import {
  ChatOutlined,
  CreateOutlined,
  ErrorOutlined,
  InfoOutlined,
  WarningOutlined,
} from '@material-ui/icons';
import iconEnum from './Icon.enum';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  icon: {
    color: 'rgba(100,0,0,0.87)',
    fontSize: (props) => props.size + 'px',
  },
});

const Icon = (props) => {
  const { type, size = '24' } = props;
  const classes = useStyles(props);

  const icons = {
    [iconEnum.INFO]: <InfoOutlined classes={{ root: classes.icon }} />,
    [iconEnum.WARNING]: <WarningOutlined classes={{ root: classes.icon }} />,
    [iconEnum.CHAT]: <ChatOutlined classes={{ root: classes.icon }} />,
    [iconEnum.SIGNATURE]: <CreateOutlined classes={{ root: classes.icon }} />,
    [iconEnum.ERROR]: <ErrorOutlined classes={{ root: classes.icon }} />,
  };

  return icons[type];
};

export default Icon;
