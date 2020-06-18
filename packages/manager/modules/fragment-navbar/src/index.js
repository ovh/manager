/* eslint-disable */
import React from 'react';
import ReactDOM from 'react-dom';
import { FragmentApi } from '@ovh-ux/ovh-ufrontend';
import { Sidebar } from './component.jsx';

FragmentApi.register('navbar', (element, config) => {
  ReactDOM.render(
    <Sidebar user={config.user} />,
    element,
  );
});
/* eslint-enable */
