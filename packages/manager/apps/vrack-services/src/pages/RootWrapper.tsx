import React from 'react';
import { Outlet } from 'react-router-dom';
import { useRouteSynchro } from '@/router/use-route-synchro';
import { useVrackServicesList } from '@/utils/vs-utils';
import { ErrorPage } from '@/components/Error';

export const RootWrapper = () => {
  const { isError, error } = useVrackServicesList();
  useRouteSynchro();

  return (
    <React.Suspense>
      {isError ? <ErrorPage error={error} /> : <Outlet />}
    </React.Suspense>
  );
};

export default RootWrapper;
