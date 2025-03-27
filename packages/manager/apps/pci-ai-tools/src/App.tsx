import React, { useEffect } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { useShell } from '@ovh-ux/manager-react-shell-client';
import Router from './routes/Router';
import queryClient from './query.client';
import { useLoadingIndicatorContext } from './contexts/LoadingIndicator.context';

function App() {
  const { loading } = useLoadingIndicatorContext();
  const shell = useShell();
  useEffect(() => {
    shell.ux.hidePreloader();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      {loading && <h1>Loading</h1>}
      <React.Suspense fallback={<></>}>
        <Router />
      </React.Suspense>
    </QueryClientProvider>
  );
}

export default App;
