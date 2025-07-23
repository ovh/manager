import { lazy } from 'react';
import { Route } from 'react-router-dom';
import { ErrorBoundary } from '@ovh-ux/manager-react-components';
import { urls } from '@/routes/routes.constant';

const LayoutPage = lazy(() => import('@/pages/layout'));
const rootPage = lazy(() => import('@/pages/index'));
const kmsPage = lazy(() => import('@/pages/key-management-service'));
const secretManagerPage = lazy(() => import('@/pages/secret-manager'));

export default (
  <Route
    path={urls.root}
    Component={LayoutPage}
    errorElement={
      <ErrorBoundary
        isPreloaderHide={true}
        isRouteShellSync={true}
        redirectionApp="okms"
      />
    }
  >
    <Route index Component={rootPage} />
    <Route path={urls.kms} Component={kmsPage} />
    <Route path={urls.secretManager} Component={secretManagerPage} />
  </Route>
);
