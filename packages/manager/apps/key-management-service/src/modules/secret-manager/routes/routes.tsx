import React from 'react';
import { Route } from 'react-router-dom';
import { ErrorBoundary } from '@ovh-ux/manager-react-components';
import {
  SECRET_MANAGER_ROUTES_URIS,
  SECRET_MANAGER_URL_PARAMS,
} from './routes.constants';
import NotFound from '@/pages/404';

const KmsLayout = React.lazy(() => import('@/pages/layout'));
const Root = React.lazy(() =>
  import('@/modules/secret-manager/pages/root/Root.page'),
);
const Onboarding = React.lazy(() =>
  import('@/modules/secret-manager/pages/onboarding/Onboarding.page'),
);
const SecretDomains = React.lazy(() =>
  import('@/modules/secret-manager/pages/domains/Domains.page'),
);
const SecretListing = React.lazy(() =>
  import('@/modules/secret-manager/pages/listing/Listing.page'),
);
const SecretDashboard = React.lazy(() =>
  import('@/modules/secret-manager/pages/dashboard/Dashboard.page'),
);
const SecretGeneralInformation = React.lazy(() =>
  import(
    '@/modules/secret-manager/pages/dashboard/generalInformation/GeneralInformation.page'
  ),
);
const SecretVersions = React.lazy(() =>
  import('@/modules/secret-manager/pages/dashboard/versions/Versions.page'),
);
const SecretCreate = React.lazy(() =>
  import('@/modules/secret-manager/pages/create/Create.page'),
);
const OrderOkms = React.lazy(() =>
  import('@/common/pages/OrderOkmsModal/OrderOkmsModal.page'),
);

export default (
  <Route
    path={SECRET_MANAGER_ROUTES_URIS.root}
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
    <Route index Component={Root} />
    <Route
      path={SECRET_MANAGER_ROUTES_URIS.onboarding}
      Component={Onboarding}
    />
    <Route path={SECRET_MANAGER_ROUTES_URIS.create} Component={SecretCreate}>
      <Route
        path={`${SECRET_MANAGER_ROUTES_URIS.order}/${SECRET_MANAGER_URL_PARAMS.region}`}
        Component={OrderOkms}
      />
    </Route>
    <Route
      path={`${SECRET_MANAGER_ROUTES_URIS.region}/${SECRET_MANAGER_URL_PARAMS.region}`}
      Component={SecretDomains}
    />
    <Route path={SECRET_MANAGER_URL_PARAMS.domainId}>
      <Route index Component={SecretListing} />
      <Route
        path={SECRET_MANAGER_URL_PARAMS.secretPath}
        Component={SecretDashboard}
      >
        <Route index Component={SecretGeneralInformation} />
        <Route
          path={SECRET_MANAGER_ROUTES_URIS.versions}
          Component={SecretVersions}
        />
      </Route>
    </Route>
    <Route path={'*'} element={<NotFound />} />
  </Route>
);
