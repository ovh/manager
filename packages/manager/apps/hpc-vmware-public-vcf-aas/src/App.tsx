import React, { Suspense } from 'react';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import {
  RouterProvider,
  createHashRouter,
  createRoutesFromElements,
} from 'react-router-dom';
import Routes from '@/routes/routes';
import { MessageContextProvider } from './context/Message.context';
import Loading from './components/loading/Loading.component';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 300_000,
    },
  },
});

function App() {
  const routes = createHashRouter(createRoutesFromElements(Routes));

  return (
    <QueryClientProvider client={queryClient}>
      <MessageContextProvider>
        <Suspense fallback={<Loading />}>
          <RouterProvider router={routes} />
        </Suspense>
      </MessageContextProvider>
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}

export default App;
