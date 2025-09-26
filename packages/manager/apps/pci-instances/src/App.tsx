import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { odsSetup } from '@ovhcloud/ods-common-core';
import queryClient from '@/queryClient';
import '@ovhcloud/ods-theme-blue-jeans';
import Router from './routes/Router';
import { createTanStackStore } from './adapters/tanstack-query/store/createTanStackStore';
import { Deps } from './deps/deps';

export const deps: Deps = {
  store: createTanStackStore(),
};

odsSetup();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
