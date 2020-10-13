import React from 'react';
import {
  ChatOutlined,
  CreateOutlined,
  InfoOutlined,
  WarningOutlined,
} from '@material-ui/icons';
import iconEnum from './threadIcon.enum';

const ThreadIcon = (props) => {
  const { type } = props;

  const icons = {
    [iconEnum.INFO]: <InfoOutlined color="action" />,
    [iconEnum.WARNING]: <WarningOutlined color="action" />,
    [iconEnum.CHAT]: <ChatOutlined color="action" />,
    [iconEnum.SIGNATURE]: <CreateOutlined color="action" />,
  };

  return icons[type];
};

export default ThreadIcon;
