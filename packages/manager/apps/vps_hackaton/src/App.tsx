import { Suspense, useMemo } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { RouterProvider, createHashRouter } from 'react-router-dom';
import { odsSetup } from '@ovhcloud/ods-common-core';
import '@ovhcloud/ods-theme-blue-jeans';
import { queryClient } from './queryClient';
import { routes } from './routes/Routes';

odsSetup();

const LoadingFallback = () => (
  <div className="flex h-screen items-center justify-center">
    <div className="animate-pulse text-lg">Loading...</div>
  </div>
);

const Router = () => {
  const router = useMemo(() => createHashRouter(routes), []);
  return <RouterProvider router={router} />;
};

export const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Suspense fallback={<LoadingFallback />}>
        <Router />
      </Suspense>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

export default App;
