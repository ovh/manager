import React from 'react';
import { Route } from 'react-router-dom';
import { ErrorBoundary } from '@ovh-ux/manager-react-components';
import {
  SECRET_MANAGER_ROUTES_URLS,
  SECRET_MANAGER_URL_PARAMS,
} from './routes.constants';
import NotFound from '@/pages/404';

const KmsLayout = React.lazy(() => import('@/pages/layout'));
const Root = React.lazy(() =>
  import('@/modules/secret-manager/pages/root/root.page'),
);
const Onboarding = React.lazy(() =>
  import('@/modules/secret-manager/pages/onboarding/onboarding.page'),
);
const SecretListing = React.lazy(() =>
  import('@/modules/secret-manager/pages/listing.page'),
);
const SecretDetail = React.lazy(() =>
  import('@/modules/secret-manager/pages/detail.page'),
);
const SecretCreate = React.lazy(() =>
  import('@/modules/secret-manager/pages/create.page'),
);

export default (
  <Route
    path={SECRET_MANAGER_ROUTES_URLS.secretManagerRoot}
    Component={KmsLayout}
    id={'secret-manager-root'}
    errorElement={
      <ErrorBoundary
        redirectionApp="key-management-service"
        isPreloaderHide={true}
        isRouteShellSync={true}
      />
    }
  >
    <Route
      path={SECRET_MANAGER_ROUTES_URLS.secretManagerRoot}
      Component={Root}
    />
    <Route
      path={SECRET_MANAGER_ROUTES_URLS.secretManagerOnboarding}
      Component={Onboarding}
    />
    <Route
      path={SECRET_MANAGER_ROUTES_URLS.secretListing(
        SECRET_MANAGER_URL_PARAMS.domainId,
      )}
      Component={SecretListing}
    />
    <Route
      path={SECRET_MANAGER_ROUTES_URLS.secretDashboard(
        SECRET_MANAGER_URL_PARAMS.domainId,
        SECRET_MANAGER_URL_PARAMS.secretId,
      )}
      Component={SecretDetail}
    />
    <Route
      path={SECRET_MANAGER_ROUTES_URLS.secretCreate}
      Component={SecretCreate}
    />
    <Route path={'*'} element={<NotFound />} />
  </Route>
);
