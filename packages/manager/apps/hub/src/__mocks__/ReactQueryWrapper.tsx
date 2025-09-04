import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PropsWithChildren } from 'react';

export function ReactQueryWrapper({
  children,
  client,
}: PropsWithChildren<{ client?: QueryClient }>) {
  const queryClient = client ?? new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

export default ReactQueryWrapper;
