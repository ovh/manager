import React from 'react';
import { Outlet } from 'react-router-dom';
import { useRouteSynchro } from '@/router/use-route-synchro';
import { useVrackServicesList } from '@/utils/vs-utils';
import { ErrorPage } from '@/components/Error';

export const RootWrapper = () => {
  const { isError, error } = useVrackServicesList();
  useRouteSynchro();

  if (isError) {
    return <ErrorPage error={error} />;
  }

  return (
    <React.Suspense>
      <Outlet />
    </React.Suspense>
  );
};

export default RootWrapper;
