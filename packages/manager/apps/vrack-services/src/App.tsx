import React from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import { MessageContextProvider } from '@/components/feedback-messages/Messages.context';

import { AppRoutes } from './AppRoutes';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: import.meta.env.VITE_TEST_BDD ? false : 3,
      staleTime: 300_000,
    },
  },
});

export const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <MessageContextProvider>
        <AppRoutes />
      </MessageContextProvider>
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
};
