import React from 'react';
import { useRoutes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import useBreadcrumbs, {
  createRoutesFromChildren,
} from 'use-react-router-breadcrumbs';
import { Breadcrumb } from '@ovh-ux/manager-react-core-components';

import Routing from './pages/Routing';

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
