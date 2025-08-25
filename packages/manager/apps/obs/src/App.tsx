import { Suspense, useEffect, useContext } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import {
  RouterProvider,
  createHashRouter,
  createRoutesFromElements,
} from 'react-router-dom';
import Routes from './routes/routes';
import queryClient from './queryClient';

function App() {
  const { shell } = useContext(ShellContext);
  const router = createHashRouter(createRoutesFromElements(Routes));

  useEffect(() => {
    shell.ux.hidePreloader();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Suspense fallback={<span>Loading routes ...</span>}>
        <RouterProvider router={router} />
      </Suspense>
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}

export default App;
