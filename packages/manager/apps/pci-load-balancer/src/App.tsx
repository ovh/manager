import { odsSetup } from '@ovhcloud/ods-common-core';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import {
  createHashRouter,
  createRoutesFromElements,
  RouterProvider,
} from 'react-router-dom';
import Routes from '@/routes';
import queryClient from './queryClient';

import '@ovhcloud/ods-theme-blue-jeans';

odsSetup();

const routes = createHashRouter(createRoutesFromElements(Routes));

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={routes} />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
