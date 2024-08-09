import React, { useEffect, useContext } from 'react';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { odsSetup } from '@ovhcloud/ods-common-core';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { RouterProvider, createHashRouter } from 'react-router-dom';
import { Routes } from './routes/routes';

odsSetup();

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 300_000,
    },
  },
});

const router = createHashRouter(Routes);

const Router = () => <RouterProvider router={router} />;

function App() {
  const { shell } = useContext(ShellContext);

  useEffect(() => {
    shell.ux.hidePreloader();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Router />
    </QueryClientProvider>
  );
}

export default App;
