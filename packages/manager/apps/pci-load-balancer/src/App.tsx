import { RouterProvider, createHashRouter, createRoutesFromElements } from 'react-router-dom';

import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import { odsSetup } from '@ovhcloud/ods-common-core';
import { Toaster } from '@ovhcloud/ods-react';
import '@ovhcloud/ods-theme-blue-jeans';

import Routes from '@/routes';

import queryClient from './queryClient';

odsSetup();

const routes = createHashRouter(createRoutesFromElements(Routes));

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster />
      <RouterProvider router={routes} />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
