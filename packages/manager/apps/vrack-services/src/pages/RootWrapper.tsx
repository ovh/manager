import React from 'react';
import { Outlet } from 'react-router-dom';
import { useRouteSynchro } from '@ovh-ux/manager-react-shell-client';
import { useVrackServicesList } from '@/utils/vs-utils';
import { ErrorPage } from '@/components/Error';

export default function RootWrapper() {
  const { isError, error } = useVrackServicesList();
  useRouteSynchro();

  return (
    <React.Suspense>
      {isError ? <ErrorPage error={error} /> : <Outlet />}
    </React.Suspense>
  );
}
