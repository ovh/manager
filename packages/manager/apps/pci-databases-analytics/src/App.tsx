import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import React, { useEffect } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { useShell } from '@ovh-ux/manager-react-shell-client';
import queryClient from './query.client';
import Router from './routes/Router';
import Loading from './components/loading/Loading.component';
import { useLoadingIndicatorContext } from './contexts/LoadingIndicator.context';
import ProgressLoader from './components/loading/ProgressLoader.component';

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
        <ReactQueryDevtools initialIsOpen={false} />
      </React.Suspense>
    </QueryClientProvider>
  );
}

export default App;
