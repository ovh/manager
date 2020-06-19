/* eslint-disable */
import React from 'react';
import ReactDOM from 'react-dom';
import { registerFragment } from '@ovh-ux/manager-ufrontend';
import { Sidebar } from './component.jsx';

registerFragment('navbar', ({ element, config, api }) => {
  ReactDOM.render(
    <Sidebar user={config.user} />,
    element,
  );
  api.messenger.on('ready', ({ from }) => {
    if (from !== 'navbar') {
      console.log('navbar received ready from', from);
    }
  });
  api.messenger.emit('ready');
});
/* eslint-enable */
