import { Suspense } from 'react';

import { RouterProvider, createHashRouter, createRoutesFromElements } from 'react-router-dom';

import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import Routes from '@/routes/routes';

import Loading from './components/loading/Loading.component';
import queryClient from './queryClient';

function App() {
  const routes = createHashRouter(createRoutesFromElements(Routes));

  return (
    <QueryClientProvider client={queryClient}>
      <Suspense fallback={<Loading />}>
        <RouterProvider router={routes} />
      </Suspense>
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}

export default App;
