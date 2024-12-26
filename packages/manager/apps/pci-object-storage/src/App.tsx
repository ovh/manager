import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { HashRouter } from 'react-router-dom';
import RoutesComponent from '@/routes';
import queryClient from './queryClient';

import '@ovhcloud/ods-themes/default';
import '@ovh-ux/manager-react-components/dist/style.css';
import '@ovh-ux/manager-pci-common/dist/style.css';

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
