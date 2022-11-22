import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import {{pascalCase appName}}Routing from './pages/Routing';

const queryClient = new QueryClient();

export default function App() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <{{pascalCase appName}}Routing />
        <ReactQueryDevtools />
      </QueryClientProvider>
    </>
  );
}
