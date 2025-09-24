import React, { useEffect } from 'react';
import { useShell } from '@ovh-ux/manager-react-shell-client';
import { QueryClientProvider } from '@tanstack/react-query';
import queryClient from './query.client';
import Router from './routes/Router';
import Loading from './components/loading/Loading.component';
import ProgressLoader from './components/loading/ProgressLoader.component';
import './global.css';
import { useLoadingIndicatorContext } from './contexts/LoadingIndicator.context';

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
