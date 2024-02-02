import { RouterProvider, createHashRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { odsSetup } from '@ovhcloud/ods-common-core';
import * as React from 'react';

import '@ovhcloud/ods-theme-blue-jeans';
import './globals.css';

import { routes } from './router/index';

odsSetup();

const router = createHashRouter(routes);
const queryClient = new QueryClient();

function App() {
  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <React.Suspense fallback={<p>Loading</p>}>
          <RouterProvider router={router} />
        </React.Suspense>
      </QueryClientProvider>
    </React.StrictMode>
  );
}

export default App;
