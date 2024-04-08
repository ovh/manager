import React, { useEffect } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { odsSetup } from '@ovhcloud/ods-common-core';
import { useShell } from '@ovh-ux/manager-react-shell-client';

import '@ovhcloud/ods-theme-blue-jeans';
import './global.css';

import queryClient from './query.client';
import Router from './Router';
import Loading from './components/Loading/Loading';
import { useLoadingIndicatorContext } from './contexts/loadingIndicatorContext';
import ProgressLoader from './components/Loading/ProgressLoader';

odsSetup();

function App() {
  const { loading } = useLoadingIndicatorContext();
  const shell = useShell();
  useEffect(() => {
    shell.ux.hidePreloader();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      {loading && <ProgressLoader />}
      <React.Suspense fallback={<Loading />}>
        <Router />
      </React.Suspense>
    </QueryClientProvider>
  );
}

export default App;
