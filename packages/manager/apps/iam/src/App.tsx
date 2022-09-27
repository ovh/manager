import React from 'react';
// import { useRoutes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import { Box, Image, Wrap, WrapItem, Center } from '@chakra-ui/react';

// import Routing from './Routing';

const queryClient = new QueryClient();

export default function App() {
  // const routing = createRoutesFromChildren(Routing());
  return (
    <>
      <QueryClientProvider client={queryClient}>
        IAM APP
        {/* {useRoutes(routing)} */}
        <ReactQueryDevtools />
      </QueryClientProvider>
    </>
  );
}
