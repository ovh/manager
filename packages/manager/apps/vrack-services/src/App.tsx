import React, { Suspense } from 'react';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { useFeatureAvailability } from '@ovh-ux/manager-react-components';
import {
  RouterProvider,
  createHashRouter,
  createRoutesFromElements,
} from 'react-router-dom';
import ComponentRoutes from '@/routes/routes';
import { MessageContextProvider } from '@/components/feedback-messages/Messages.context';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: import.meta.env.VITE_TEST_BDD ? false : 3,
      staleTime: 300_000,
    },
  },
});

const Routes: React.FC = () => {
  const { data, isLoading, isError } = useFeatureAvailability([
    'vrack-services',
  ]);
  const { shell } = React.useContext(ShellContext);
  const router = createHashRouter(createRoutesFromElements(ComponentRoutes));
  const isAppAvailable = !!data?.['vrack-services'];

  React.useEffect(() => {
    if (isAppAvailable) {
      shell.ux.hidePreloader();
    } else if ((!isLoading || isError) && !isAppAvailable) {
      shell.navigation
        .getURL('hub', '/', {})
        .then((url: string) => window.location.replace(url));
    }
  }, [isLoading, isError, isAppAvailable]);

  if (isLoading || !isAppAvailable) {
    return <></>;
  }

  return (
    <Suspense fallback={<span>Loading routes ...</span>}>
      <RouterProvider router={router} />
    </Suspense>
  );
};

export const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <MessageContextProvider>
        <Routes />
      </MessageContextProvider>
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
};
// test duplicate translation
