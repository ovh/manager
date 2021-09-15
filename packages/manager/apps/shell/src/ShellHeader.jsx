import React from 'react';
import ReactDOM from 'react-dom';
import ReactNavbar from '@ovh-ux/react-navbar';

import appContext from './context';

ReactDOM.render(
  <ReactNavbar
    environment={appContext.getEnvironment()}
  />,
  document.getElementById('shell-header'),
);
