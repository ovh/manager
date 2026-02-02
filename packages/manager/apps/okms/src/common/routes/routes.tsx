import { Navigate, Route } from 'react-router-dom';

import NotFound from '@key-management-service/pages/404';
import kmsRoutes from '@key-management-service/routes/routes';
import { KMS_ROUTES_URLS } from '@key-management-service/routes/routes.constants';
import secretManagerRoutes from '@secret-manager/routes/routes';

import { ErrorBoundary } from '@ovh-ux/manager-react-components';

import { APP_NAME } from '@/App.constants';

import MainLayout from '../pages/Main.layout';

export default (
  <>
    <Route path="/" element={<Navigate to={KMS_ROUTES_URLS.kmsListing} replace={true} />} />
    <Route
      path={'/'}
      Component={MainLayout}
      id={'root'}
      errorElement={
        <ErrorBoundary redirectionApp={APP_NAME} isPreloaderHide={true} isRouteShellSync={true} />
      }
    >
      {kmsRoutes}
      {secretManagerRoutes}
      <Route path="*" element={<NotFound />} />
    </Route>
  </>
);
