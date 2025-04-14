import React from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { RouterProvider, createHashRouter } from 'react-router-dom';
import routes from './routes/routes';
import queryClient from './utils/queryClient';
import { MessageContextProvider } from './context/Message.context';

function App() {
  const router = createHashRouter(routes);

  return (
    <QueryClientProvider client={queryClient}>
      <MessageContextProvider>
        <RouterProvider router={router} />
      </MessageContextProvider>
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}

export default App;
