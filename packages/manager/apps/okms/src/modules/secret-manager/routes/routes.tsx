import React from 'react';

import { Navigate, Route } from 'react-router-dom';

import { SECRET_MANAGER_ROUTES_URIS, SECRET_MANAGER_URL_PARAMS } from './routes.constants';

const Root = React.lazy(() => import('@/modules/secret-manager/pages/root/Root.page'));
const Onboarding = React.lazy(
  () => import('@/modules/secret-manager/pages/onboarding/Onboarding.page'),
);
const OkmsList = React.lazy(() => import('@/modules/secret-manager/pages/okms-list/OkmsList.page'));

const OkmsDashboard = React.lazy(
  () => import('@secret-manager/pages/okms-dashboard/OkmsDashboard.page'),
);
const OkmsDashboardGeneralInformation = React.lazy(
  () => import('@secret-manager/pages/okms-dashboard/general-information/GeneralInformations.page'),
);
const OkmsDashboardLogs = React.lazy(() => import('@/common/pages/okms-logs/OkmsLogs.page'));

const OkmsUpdateNameModal = React.lazy(
  () =>
    import('@secret-manager/pages/okms-dashboard/okms-update-name-modal/OkmsUpdateNameModal.page'),
);

const OkmsTerminateModal = React.lazy(
  () => import('@secret-manager/pages/okms-dashboard/okms-terminate-modal/OkmsTerminateModal.page'),
);

const OkmsEditSecretConfigDrawer = React.lazy(
  () =>
    import(
      '@secret-manager/pages/okms-dashboard/okms-edit-secret-config-drawer/OkmsEditSecretConfigDrawer.page'
    ),
);

const SecretList = React.lazy(
  () => import('@/modules/secret-manager/pages/secret-list/SecretList.page'),
);
const DeleteSecretModal = React.lazy(
  () => import('@/modules/secret-manager/pages/modals/delete-secret-modal/DeleteSecretModal.page'),
);
const Secret = React.lazy(() => import('@/modules/secret-manager/pages/secret/Secret.page'));
const SecretGeneralInformation = React.lazy(
  () => import('@/modules/secret-manager/pages/secret/general-information/GeneralInformation.page'),
);
const SecretVersionList = React.lazy(
  () => import('@/modules/secret-manager/pages/secret/version-list/VersionList.page'),
);
const SecretValueDrawer = React.lazy(
  () => import('@secret-manager/pages/drawers/secret-value-drawer/SecretValueDrawer.page'),
);
const CreateVersionDrawer = React.lazy(
  () => import('@secret-manager/pages/drawers/create-version-drawer/CreateVersionDrawer.page'),
);
const EditMetadataDrawer = React.lazy(
  () => import('@secret-manager/pages/drawers/edit-metadata-drawer/EditMetadataDrawer.page'),
);
const DeleteVersionModal = React.lazy(
  () => import('@secret-manager/pages/secret/version-list/delete/DeleteSecretVersionModal.page'),
);
const CreateSecret = React.lazy(
  () => import('@/modules/secret-manager/pages/create-secret/CreateSecret.page'),
);
const OrderOkmsModal = React.lazy(
  () => import('@/common/pages/order-okms-modal/OrderOkmsModal.page'),
);

export default (
  <Route path={SECRET_MANAGER_ROUTES_URIS.root} id={'secret-manager-root'}>
    <Route index Component={Root} />
    <Route path={SECRET_MANAGER_ROUTES_URIS.onboarding} Component={Onboarding} />
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
      <Route path={`${SECRET_MANAGER_ROUTES_URIS.dashboard}`} Component={OkmsDashboard}>
        <Route path={''} Component={OkmsDashboardGeneralInformation}>
          <Route path={`${SECRET_MANAGER_ROUTES_URIS.update}`} Component={OkmsUpdateNameModal} />
          <Route path={`${SECRET_MANAGER_ROUTES_URIS.terminate}`} Component={OkmsTerminateModal} />
          <Route
            path={`${SECRET_MANAGER_ROUTES_URIS.editSecretConfig}`}
            Component={OkmsEditSecretConfigDrawer}
          />
        </Route>
        <Route path={`${SECRET_MANAGER_ROUTES_URIS.logs}/*`} Component={OkmsDashboardLogs} />
      </Route>
      <Route path={SECRET_MANAGER_URL_PARAMS.secretPath} Component={Secret}>
        <Route path={''} Component={SecretGeneralInformation}>
          <Route path={SECRET_MANAGER_ROUTES_URIS.value} Component={SecretValueDrawer} />
          <Route path={SECRET_MANAGER_ROUTES_URIS.createVersion} Component={CreateVersionDrawer} />
          <Route path={SECRET_MANAGER_ROUTES_URIS.editMetadata} Component={EditMetadataDrawer} />
          <Route path={SECRET_MANAGER_ROUTES_URIS.delete} Component={DeleteSecretModal} />
        </Route>
        <Route path={SECRET_MANAGER_ROUTES_URIS.versionList} Component={SecretVersionList}>
          <Route path={SECRET_MANAGER_ROUTES_URIS.create} Component={CreateVersionDrawer} />
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
  </Route>
);
