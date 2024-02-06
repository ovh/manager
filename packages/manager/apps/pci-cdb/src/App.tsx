import { RouterProvider, createHashRouter } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { odsSetup } from '@ovhcloud/ods-common-core';
import * as React from 'react';

import '@ovhcloud/ods-theme-blue-jeans';
import './globals.css';

import { routes } from './router/index';
import queryClient from './queryClient';

odsSetup();

const router = createHashRouter(routes);

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
