import { RouterProvider, createHashRouter } from 'react-router-dom';

import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import { odsSetup } from '@ovhcloud/ods-common-core';
import '@ovhcloud/ods-theme-blue-jeans';
import '@ovhcloud/ods-themes/default';

import '@ovh-ux/manager-pci-common/dist/style.css';

import { GeneralBannerContextProvider } from '@/contexts/GeneralBanner.context';
import appRoutes from '@/routes';

import './index.scss';
import queryClient from './queryClient';

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
