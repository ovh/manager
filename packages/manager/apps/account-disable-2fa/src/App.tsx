import React from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { odsSetup } from '@ovhcloud/ods-common-core';
import { RouterProvider, createHashRouter } from 'react-router-dom';
import '@ovhcloud/ods-theme-blue-jeans';
import queryClient from './query.client';
import { Routes } from './routes';

odsSetup();

const router = createHashRouter(Routes);

const Router = () => <RouterProvider router={router} />;

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
