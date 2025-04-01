import React, { useEffect } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { useShell } from '@ovh-ux/manager-react-shell-client';
import Router from './routes/Router';
import queryClient from './query.client';
import { useLoadingIndicatorContext } from './contexts/LoadingIndicator.context';
import ProgressLoader from './components/loading/ProgressLoader.component';
import Loading from './components/loading/Loading.component';

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
