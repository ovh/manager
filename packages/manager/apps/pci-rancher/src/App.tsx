import React, { useContext, useEffect } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { odsSetup } from '@ovhcloud/ods-common-core';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import '@ovhcloud/ods-theme-blue-jeans';
import queryClient from './query.client';
import Router from './Router';

odsSetup();

function App() {
  const { shell } = useContext(ShellContext);
  useEffect(() => {
    shell.ux.hidePreloader();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
