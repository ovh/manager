import React from 'react';
import { useRoutes } from 'react-router-dom';
import useBreadcrumbs, {
  createRoutesFromChildren,
} from 'use-react-router-breadcrumbs';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import Breadcrumb from '@/components/Breadcrumb';

import Routing from './Routing';

const queryClient = new QueryClient();

export default function App() {
  const routing = createRoutesFromChildren(Routing());
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Breadcrumb breadcrumbs={useBreadcrumbs(routing)} />
        {useRoutes(routing)}
        <ReactQueryDevtools />
      </QueryClientProvider>
    </>
  );
}
