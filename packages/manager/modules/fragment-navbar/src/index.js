/* eslint-disable */
import React from 'react';
import ReactDOM from 'react-dom';
import { getFragmentApi } from '@ovh-ux/manager-ufrontend';
import { Sidebar } from './component.jsx';

getFragmentApi().register('navbar', (element, config, messenger) => {
  ReactDOM.render(
    <Sidebar user={config.user} />,
    element,
  );
  messenger.emit('ready');
  messenger.on('application.ready', () => {
    console.log('navbar received application.ready');
  });
});
/* eslint-enable */
