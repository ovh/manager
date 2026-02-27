import React, { Suspense } from 'react';

import { RouterProvider, createHashRouter, createRoutesFromElements } from 'react-router-dom';

import { useFeatureAvailability } from '@ovh-ux/manager-module-common-api';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';

import ComponentRoutes from '@/routes/routes';

export const AppRoutes: React.FC = () => {
  const { data, isLoading, isError } = useFeatureAvailability(['vrack-services']);
  const { shell } = React.useContext(ShellContext);
  const router = createHashRouter(createRoutesFromElements(ComponentRoutes));
  const isAppAvailable = !!data?.['vrack-services'];

  React.useEffect(() => {
    if (isAppAvailable) {
      shell.ux.hidePreloader();
    } else if ((!isLoading || isError) && !isAppAvailable) {
      shell.navigation.getURL('hub', '/', {}).then((url) => window.location.replace(url as string));
    }
  }, [isLoading, isError, isAppAvailable, shell.navigation, shell.ux]);

  if (isLoading || !isAppAvailable) {
    return <></>;
  }

  return (
    <Suspense fallback={<span>Loading routes ...</span>}>
      <RouterProvider router={router} />
    </Suspense>
  );
};
