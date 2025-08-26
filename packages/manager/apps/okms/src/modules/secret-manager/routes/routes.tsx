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
const SecretValueDrawer = React.lazy(() =>
  import('@secret-manager/pages/drawers/valueDrawer/ValueDrawer.page'),
);
const SecretVersionsCreateDrawer = React.lazy(() =>
  import(
    '@secret-manager/pages/drawers/createVersionDrawer/CreateVersionDrawer.page'
  ),
);
const SecretVersionsDeleteModal = React.lazy(() =>
  import(
    '@secret-manager/pages/dashboard/versions/delete/DeleteSecretVersionModal.page'
  ),
);
const SecretCreate = React.lazy(() =>
  import('@/modules/secret-manager/pages/create/Create.page'),
);
const OrderOkmsModal = React.lazy(() =>
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
        Component={OrderOkmsModal}
      />
    </Route>
    <Route
      path={`${SECRET_MANAGER_ROUTES_URIS.region}/${SECRET_MANAGER_URL_PARAMS.region}`}
      Component={SecretDomains}
    />
    <Route path={SECRET_MANAGER_URL_PARAMS.domainId}>
      <Route path={''} Component={SecretListing}>
        <Route
          path={`${SECRET_MANAGER_ROUTES_URIS.value}/${SECRET_MANAGER_URL_PARAMS.secretPath}`}
          Component={SecretValueDrawer}
        />
        <Route
          path={`${SECRET_MANAGER_ROUTES_URIS.createVersion}/${SECRET_MANAGER_URL_PARAMS.secretPath}`}
          Component={SecretVersionsCreateDrawer}
        />
      </Route>
      <Route
        path={SECRET_MANAGER_URL_PARAMS.secretPath}
        Component={SecretDashboard}
      >
        <Route path={''} Component={SecretGeneralInformation}>
          <Route
            path={SECRET_MANAGER_ROUTES_URIS.value}
            Component={SecretValueDrawer}
          />
          <Route
            path={SECRET_MANAGER_ROUTES_URIS.createVersion}
            Component={SecretVersionsCreateDrawer}
          />
        </Route>
        <Route
          path={SECRET_MANAGER_ROUTES_URIS.versions}
          Component={SecretVersions}
        >
          <Route
            path={SECRET_MANAGER_ROUTES_URIS.create}
            Component={SecretVersionsCreateDrawer}
          />
          <Route
            path={`${SECRET_MANAGER_URL_PARAMS.versionId}/${SECRET_MANAGER_ROUTES_URIS.delete}`}
            Component={SecretVersionsDeleteModal}
          />
        </Route>
      </Route>
    </Route>
    <Route path={'*'} element={<NotFound />} />
  </Route>
);
