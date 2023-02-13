import React from 'react';
import { createIcon } from '@chakra-ui/react';

export const ServerIcon = createIcon({
  displayName: 'ServerIcon',
  viewBox: '0 0 32 32',
  path: [
    <path
      fill="currentColor"
      d="M30.5 10c.828 0 1.5.672 1.5 1.5v9c0 .828-.672 1.5-1.5 1.5h-29C.672 22 0 21.328 0 20.5v-9c0-.828.672-1.5 1.5-1.5h29zm0 1h-29c-.276 0-.5.224-.5.5v9c0 .276.224.5.5.5h29c.276 0 .5-.224.5-.5v-9c0-.276-.224-.5-.5-.5zM27 14c.552 0 1 .448 1 1s-.448 1-1 1-1-.448-1-1 .448-1 1-1z"
    />,
  ],
});

export default ServerIcon;
