import React from 'react';
import { Navigate, Route } from 'react-router-dom';
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
const OkmsList = React.lazy(() =>
  import('@/modules/secret-manager/pages/okmsList/OkmsList.page'),
);
const SecretList = React.lazy(() =>
  import('@/modules/secret-manager/pages/secretList/SecretList.page'),
);
const DeleteSecretModal = React.lazy(() =>
  import(
    '@/modules/secret-manager/pages/modals/deleteSecretModal/DeleteSecretModal.page'
  ),
);
const Secret = React.lazy(() =>
  import('@/modules/secret-manager/pages/secret/Secret.page'),
);
const SecretGeneralInformation = React.lazy(() =>
  import(
    '@/modules/secret-manager/pages/secret/generalInformation/GeneralInformation.page'
  ),
);
const SecretVersionList = React.lazy(() =>
  import('@/modules/secret-manager/pages/secret/versionList/VersionList.page'),
);
const SecretValueDrawer = React.lazy(() =>
  import(
    '@secret-manager/pages/drawers/secretValueDrawer/SecretValueDrawer.page'
  ),
);
const CreateVersionDrawer = React.lazy(() =>
  import(
    '@secret-manager/pages/drawers/createVersionDrawer/CreateVersionDrawer.page'
  ),
);
const EditMetadataDrawer = React.lazy(() =>
  import(
    '@secret-manager/pages/drawers/editMetadataDrawer/EditMetadataDrawer.page'
  ),
);
const DeleteVersionModal = React.lazy(() =>
  import(
    '@secret-manager/pages/secret/versionList/delete/DeleteSecretVersionModal.page'
  ),
);
const CreateSecret = React.lazy(() =>
  import('@/modules/secret-manager/pages/createSecret/CreateSecret.page'),
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
    <Route path={SECRET_MANAGER_ROUTES_URIS.create} Component={CreateSecret}>
      <Route
        path={`${SECRET_MANAGER_ROUTES_URIS.order}/${SECRET_MANAGER_URL_PARAMS.region}`}
        Component={OrderOkmsModal}
      />
    </Route>
    <Route
      path={`${SECRET_MANAGER_ROUTES_URIS.region}/${SECRET_MANAGER_URL_PARAMS.region}`}
      Component={OkmsList}
    />
    <Route path={SECRET_MANAGER_URL_PARAMS.okmsId}>
      <Route path={''} Component={SecretList}>
        <Route
          path={`${SECRET_MANAGER_ROUTES_URIS.value}/${SECRET_MANAGER_URL_PARAMS.secretPath}`}
          Component={SecretValueDrawer}
        />
        <Route
          path={`${SECRET_MANAGER_ROUTES_URIS.createVersion}/${SECRET_MANAGER_URL_PARAMS.secretPath}`}
          Component={CreateVersionDrawer}
        />
        <Route
          path={`${SECRET_MANAGER_ROUTES_URIS.delete}/${SECRET_MANAGER_URL_PARAMS.secretPath}`}
          Component={DeleteSecretModal}
        />
      </Route>
      <Route path={SECRET_MANAGER_URL_PARAMS.secretPath} Component={Secret}>
        <Route path={''} Component={SecretGeneralInformation}>
          <Route
            path={SECRET_MANAGER_ROUTES_URIS.value}
            Component={SecretValueDrawer}
          />
          <Route
            path={SECRET_MANAGER_ROUTES_URIS.createVersion}
            Component={CreateVersionDrawer}
          />
          <Route
            path={SECRET_MANAGER_ROUTES_URIS.editMetadata}
            Component={EditMetadataDrawer}
          />
          <Route
            path={SECRET_MANAGER_ROUTES_URIS.delete}
            Component={DeleteSecretModal}
          />
        </Route>
        <Route
          path={SECRET_MANAGER_ROUTES_URIS.versionList}
          Component={SecretVersionList}
        >
          <Route
            path={SECRET_MANAGER_ROUTES_URIS.create}
            Component={CreateVersionDrawer}
          />
          <Route
            path={`${SECRET_MANAGER_ROUTES_URIS.delete}/${SECRET_MANAGER_URL_PARAMS.versionId}`}
            Component={DeleteVersionModal}
          />
          <Route
            path={`${SECRET_MANAGER_ROUTES_URIS.value}/${SECRET_MANAGER_URL_PARAMS.versionId}`}
            Component={SecretValueDrawer}
          />
          <Route path="*" element={<Navigate to={''} replace />} />
        </Route>
        <Route path="*" element={<Navigate to={''} replace />} />
      </Route>
    </Route>
    <Route path={'*'} element={<NotFound />} />
  </Route>
);
