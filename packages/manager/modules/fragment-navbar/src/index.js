/* eslint-disable */
import React from 'react';
import ReactDOM from 'react-dom';
import { getFragmentApi } from '@ovh-ux/manager-ufrontend';
import { Sidebar } from './component.jsx';

getFragmentApi().register('navbar', (element, config) => {
  ReactDOM.render(
    <Sidebar user={config.user} />,
    element,
  );
});
/* eslint-enable */
