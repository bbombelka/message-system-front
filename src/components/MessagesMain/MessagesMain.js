import React from 'react';
import ThreadList from '../ThreadList/ThreadList';

const MessagesMain = ({ toggleFullscreenLoader }) => {
  return (
    <div>
      <ThreadList toggleFullscreenLoader={toggleFullscreenLoader} />
    </div>
  );
};

export default MessagesMain;
