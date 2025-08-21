import React, { Suspense } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { odsSetup } from '@ovhcloud/ods-common-core';
import {
  RouterProvider,
  createHashRouter,
  createRoutesFromElements,
} from 'react-router-dom';
import Routes from '@/routes/routes';
import queryClient from '@/queryClient';
import Loading from './components/Loading/Loading';

odsSetup();

function App() {
  const routes = createHashRouter(createRoutesFromElements(Routes));
  console.log('Fake change for test purpose');

  return (
    <QueryClientProvider client={queryClient}>
      <Suspense fallback={<Loading />}>
        <RouterProvider router={routes} />
      </Suspense>
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}

export default App;
