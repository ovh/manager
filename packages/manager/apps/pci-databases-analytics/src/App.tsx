import React, { useEffect } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { odsSetup } from '@ovhcloud/ods-common-core';
import { useShell } from '@ovh-ux/manager-react-shell-client';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';

import '@ovhcloud/ods-theme-blue-jeans';
import './global.css';

import queryClient from './query.client';
import Router from './Router';
import { useDateFnsLocale } from './hooks/useDateFnsLocale.hook';
import { useMuiLocale } from './hooks/useMuiLocale';
import Loading from './components/Loading/Loading';

odsSetup();

function App() {
  const shell = useShell();
  const fsLocale = useDateFnsLocale();
  const muiLocaleText = useMuiLocale();
  useEffect(() => {
    shell.ux.hidePreloader();
  }, []);

  return (
    <LocalizationProvider
      dateAdapter={AdapterDateFns}
      adapterLocale={fsLocale}
      localeText={
        muiLocaleText.components.MuiLocalizationProvider.defaultProps.localeText
      }
    >
      <QueryClientProvider client={queryClient}>
        <React.Suspense fallback={<Loading />}>
          <Router />
        </React.Suspense>
      </QueryClientProvider>
    </LocalizationProvider>
  );
}

export default App;
