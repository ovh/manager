import { odsSetup } from '@ovhcloud/ods-common-core';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { HashRouter } from 'react-router-dom';
import RoutesComponent from '@/routes';
import queryClient from './queryClient';

import '@ovhcloud/ods-theme-blue-jeans';

odsSetup();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <HashRouter>
        <RoutesComponent />
      </HashRouter>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
