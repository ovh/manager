import React, { Suspense, lazy } from 'react';

import '@ods/theme-blue-jeans/index.css';
import '@ods/stencil/components/react';
import './index.scss';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Loading from './loading';

const queryClient = new QueryClient();

const Services = lazy(() => import('./Services'));

export default function NashaReactApp() {
  return (
    <div>
      <QueryClientProvider client={queryClient}>
        <Suspense fallback={<Loading />}>
          <Services />
        </Suspense>
      </QueryClientProvider>
    </div>
  );
}
