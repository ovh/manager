import { RouterProvider, createHashRouter } from 'react-router-dom';

import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import { odsSetup } from '@ovhcloud/ods-common-core';
import '@ovhcloud/ods-theme-blue-jeans';

import appRoutes from '@/routes';

import queryClient from './queryClient';

odsSetup();

const router = createHashRouter(appRoutes);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router}></RouterProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
