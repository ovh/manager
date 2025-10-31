import { createHashRouter, RouterProvider } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { odsSetup } from '@ovhcloud/ods-common-core';

import appRoutes from '@/routes';
import queryClient from './queryClient';

import '@ovhcloud/ods-themes/default';
import '@ovhcloud/ods-theme-blue-jeans';
import '@ovh-ux/manager-pci-common/dist/style.css';
import './index.scss';
import { GeneralBannerContextProvider } from '@/contexts/GeneralBanner.context';

odsSetup();

const router = createHashRouter(appRoutes);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <GeneralBannerContextProvider>
        <RouterProvider router={router} />
      </GeneralBannerContextProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
