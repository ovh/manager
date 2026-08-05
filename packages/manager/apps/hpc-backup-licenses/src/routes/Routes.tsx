import React from 'react';

import { Route } from 'react-router-dom';

import { BackupLicensesRoutes } from '@ovh-ux/backup-licenses';
import { ErrorBoundary } from '@ovh-ux/manager-react-components';

import NotFound from '@/pages/not-found/404.page';

import { redirectionApp, urls } from './Routes.constants';

const MainLayoutPage = React.lazy(() => import('@/pages/Main.layout'));

export default (
  <Route
    id="root"
    path={urls.root}
    Component={MainLayoutPage}
    errorElement={
      <ErrorBoundary
        isPreloaderHide={true}
        isRouteShellSync={true}
        redirectionApp={redirectionApp}
      />
    }
  >
    {BackupLicensesRoutes}
    <Route path="*" element={<NotFound />} />
  </Route>
);
