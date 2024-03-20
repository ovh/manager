import { RouterProvider, createHashRouter } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { odsSetup } from '@ovhcloud/ods-common-core';

import appRoutes from '@/routes';
import queryClient from './queryClient';

import '@ovhcloud/ods-theme-blue-jeans';

odsSetup();

const router = createHashRouter(appRoutes);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router}></RouterProvider>
      {/* @TODO investigate errors */ false && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  );
}

export default App;
