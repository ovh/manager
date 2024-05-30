import React from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { odsSetup } from '@ovhcloud/ods-common-core';
import { RouterProvider, createHashRouter } from 'react-router-dom';
import '@ovhcloud/ods-theme-blue-jeans';
import queryClient from './query.client';
import { Routes } from './routes/routes';
import { User } from '@/components/User/context';
import UserProvider from '@/components/User/provider';

odsSetup();

const router = createHashRouter(Routes);

const Router = () => <RouterProvider router={router} />;

type AppProps = {
  user: User;
};

export default function App({ user }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <UserProvider user={user}>
        <Router />
        <ReactQueryDevtools initialIsOpen={false} />
      </UserProvider>
    </QueryClientProvider>
  );
}
