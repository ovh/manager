import React from 'react';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { odsSetup } from '@ovhcloud/ods-common-core';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { useFeatureAvailability } from '@ovh-ux/manager-react-components';
import { RouterProvider, createHashRouter } from 'react-router-dom';
import { getRoutes } from '@/routes/routes';
import { MessageContextProvider } from '@/components/feedback-messages/Messages.context';
import '@ovhcloud/ods-theme-blue-jeans';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: import.meta.env.VITE_TEST_BDD ? false : 3,
      staleTime: 300_000,
    },
  },
});

odsSetup();

const Routes: React.FC = () => {
  const { data, isLoading, isError } = useFeatureAvailability([
    'vrack-services',
  ]);
  const { shell } = React.useContext(ShellContext);
  const routes = getRoutes();
  const router = createHashRouter(routes);
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

  return <RouterProvider router={router} />;
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
