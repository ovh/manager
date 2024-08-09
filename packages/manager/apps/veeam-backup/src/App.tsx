import React, { useEffect, useContext } from 'react';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { odsSetup } from '@ovhcloud/ods-common-core';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { RouterProvider, createHashRouter } from 'react-router-dom';
import { routes } from './routes/routes';
import {
  MessageOptions,
  MessagesContext,
} from './components/Messages/Messages.context';

odsSetup();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 300_000,
    },
  },
});

export default function App() {
  const { shell } = useContext(ShellContext);
  const router = createHashRouter(routes);
  const [successMessages, setSuccessMessages] = React.useState([]);
  const [hiddenMessages, setHiddenMessages] = React.useState([]);

  const messageContext = React.useMemo(
    () => ({
      successMessages,
      hiddenMessages,
      addSuccessMessage: (message: string, options: MessageOptions) => {
        setSuccessMessages((messageList) =>
          messageList.concat({ id: Date.now(), message, options }),
        );
      },
      hideMessage: (id: number) => {
        setHiddenMessages((hiddenMessage) => hiddenMessage.concat(id));
      },
    }),
    [successMessages, hiddenMessages],
  );

  useEffect(() => {
    shell.ux.hidePreloader();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <MessagesContext.Provider value={messageContext}>
        <RouterProvider router={router} />
      </MessagesContext.Provider>
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}
