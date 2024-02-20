import React, { useEffect } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { odsSetup } from '@ovhcloud/ods-common-core';
import { useShell } from '@ovh-ux/manager-react-shell-client';

import '@ovhcloud/ods-theme-blue-jeans';
import './global.css';

import queryClient from './query.client';
import Router from './Router';

odsSetup();

function App() {
  const shell = useShell();
  useEffect(() => {
    shell.ux.hidePreloader();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <React.Suspense fallback={<p>Loading</p>}>
        <Router />
      </React.Suspense>
    </QueryClientProvider>
  );
}

export default App;
