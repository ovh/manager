import React from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import {
  RouterProvider,
  createHashRouter,
  createRoutesFromElements,
} from 'react-router-dom';
import Routes from '@/routes/routes';
import queryClient from './queryClient';

function App() {
  const routes = createHashRouter(createRoutesFromElements(Routes));

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={routes} />
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}

export default App;
