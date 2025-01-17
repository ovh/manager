import React, { useEffect } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { odsSetup } from '@ovhcloud/ods-common-core';
import { useShell } from '@ovh-ux/manager-react-shell-client';

import './global.css';
import '@ovhcloud/ods-themes/default';

import queryClient from './query.client';
import Router from './routes/Router';
import Loading from './components/loading/Loading.component';
import { useLoadingIndicatorContext } from './contexts/LoadingIndicator.context';
import ProgressLoader from './components/loading/ProgressLoader.component';

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
