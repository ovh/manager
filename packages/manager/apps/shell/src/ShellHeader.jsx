import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import ReactNavbar from './navbar/index.jsx';

import appContext from './context';

ReactDOM.render(
  <Suspense fallback="">
    <ReactNavbar
      environment={appContext.getEnvironment()}
    />
  </Suspense>,
  document.getElementById('shell-header'),
);
