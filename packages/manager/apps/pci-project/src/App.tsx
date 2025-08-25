import React, { Suspense, useEffect, useContext } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import {
  RouterProvider,
  createHashRouter,
  createRoutesFromElements,
} from 'react-router-dom';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import Routes from './routes/routes';
import queryClient from './queryClient';
import FullPageSpinner from './components/FullPageSpinner';

const getPayPalClientId = () => {
  return process.env.NODE_ENV === 'production'
    ? 'YOUR_PRODUCTION_CLIENT_ID'
    : 'sb';
};

const initialOptions = {
  clientId: getPayPalClientId(),
  locale: 'fr_FR',
  intent: 'capture',
  disableFunding: 'card',
  components: 'buttons,marks',
};

function App() {
  const { shell } = useContext(ShellContext);
  const router = createHashRouter(createRoutesFromElements(Routes));

  useEffect(() => {
    shell.ux.hidePreloader();
  }, []);

  return (
    <PayPalScriptProvider options={initialOptions}>
      <QueryClientProvider client={queryClient}>
        <Suspense fallback={<FullPageSpinner />}>
          <RouterProvider router={router} />
        </Suspense>
        <ReactQueryDevtools />
      </QueryClientProvider>
    </PayPalScriptProvider>
  );
}

export default App;
