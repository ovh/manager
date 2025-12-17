import React from 'react';

import { Route } from 'react-router-dom';

import { PageType } from '@ovh-ux/manager-react-shell-client';

import { getRouteTracking } from '@/common/utils/tracking/tracking';

import { KMS_ROUTES_URIS, KMS_URL_PARAMS } from './routes.constants';

export const COMMON_PATH = '/key-management-service';

// Kms
const KmsListing = React.lazy(
  () => import('@key-management-service/pages/listing/KmsListing.page'),
);
const KmsTerminateModal = React.lazy(
  () =>
    import(
      '@key-management-service/pages/dashboard/general-informations/terminate/terminate-kms/page'
    ),
);
const KmsCreate = React.lazy(() => import('@key-management-service/pages/create/CreateKms.page'));
const KmsCreateOrderOkmsModal = React.lazy(
  () => import('@/common/pages/order-okms-modal/OrderOkmsModal.page'),
);
const KmsOnboarding = React.lazy(
  () => import('@key-management-service/pages/onboarding/Onboarding'),
);
const KmsDashboard = React.lazy(
  () => import('@key-management-service/pages/dashboard/KmsDashboard.page'),
);
const KmsGeneralInformations = React.lazy(
  () =>
    import('@key-management-service/pages/dashboard/general-informations/GeneralInformations.page'),
);
const KmsLogs = React.lazy(() => import('@/common/pages/okms-logs/OkmsLogs.page'));
const KmsRenameModal = React.lazy(
  () =>
    import(
      '@key-management-service/pages/dashboard/general-informations/update-name/OkmsNameUpdateModal.page'
    ),
);

// Service Key
const ServiceKeyDashboard = React.lazy(
  () => import('@key-management-service/pages/service-key/dashboard/ServiceKeyDashboard.page'),
);
const ServiceKeyRenameModal = React.lazy(
  () =>
    import(
      '@key-management-service/pages/service-key/edit-service-key-name-modal/EditServiceKeyNameModal.page'
    ),
);
const ServiceKeyList = React.lazy(
  () => import('@key-management-service/pages/dashboard/service-key-list/ServiceKeyList.page'),
);
const ServiceKeyDeactivateModal = React.lazy(
  () =>
    import(
      '@key-management-service/pages/service-key/deactivate-service-key-modal/DeactivateServiceKeyModal.page'
    ),
);
const ServiceKeyCreate = React.lazy(
  () => import('@key-management-service/pages/service-key/create/CreateKey.page'),
);

// Credentials
const CredentialsList = React.lazy(
  () => import('@key-management-service/pages/dashboard/credential-list/CredentialList.page'),
);
const CredentialsListDeleteModal = React.lazy(
  () =>
    import(
      '@key-management-service/pages/dashboard/credential-list/delete/DeleteCredentialModal.page'
    ),
);
const CredentialsDashboard = React.lazy(
  () => import('@key-management-service/pages/credential/Credential.page'),
);
const CredentialsGeneralInformations = React.lazy(
  () =>
    import(
      '@key-management-service/pages/credential/general-informations/generalInformations.page'
    ),
);
const CredentialsDashboardDeleteModal = React.lazy(
  () =>
    import(
      '@key-management-service/pages/credential/general-informations/delete/DeleteCredentialModal.page'
    ),
);
const CredentialsIdentities = React.lazy(
  () => import('@key-management-service/pages/credential/identities/identities.page'),
);
const CredentialsCreate = React.lazy(
  () => import('@key-management-service/pages/credential/create/CreateCredential.page'),
);
const CredentialsCreateUserListModal = React.lazy(
  () =>
    import(
      '@key-management-service/pages/credential/create/add-users/CreateCredentialIdentityUserList.page'
    ),
);
const CredentialsCreateGroupListModal = React.lazy(
  () =>
    import(
      '@key-management-service/pages/credential/create/add-groups/CreateCredentialIdentityGroupList.page'
    ),
);
const CredentialsCreateServiceAccountListModal = React.lazy(
  () =>
    import(
      '@key-management-service/pages/credential/create/add-service-account/CreateCredentialIdentityServiceAccountList.page'
    ),
);

export default (
  <Route path={KMS_ROUTES_URIS.root} id={'kms-root'}>
    <Route path="" Component={KmsListing} handle={getRouteTracking(['okms'], PageType.listing)} />
    <Route
      path={KMS_ROUTES_URIS.kmsCreate}
      Component={KmsCreate}
      handle={getRouteTracking(['create', 'okms'], PageType.funnel)}
    >
      <Route path={KMS_URL_PARAMS.region} Component={KmsCreateOrderOkmsModal} />
    </Route>
    <Route
      path={KMS_ROUTES_URIS.kmsOnboarding}
      Component={KmsOnboarding}
      handle={getRouteTracking([], PageType.onboarding)}
    />
    <Route path={KMS_URL_PARAMS.okmsId} Component={KmsDashboard}>
      <Route
        path={''}
        Component={KmsGeneralInformations}
        handle={getRouteTracking(['okms'], PageType.dashboard)}
      >
        <Route
          path={KMS_ROUTES_URIS.kmsEditName}
          Component={KmsRenameModal}
          handle={getRouteTracking(['rename', 'okms'], PageType.popup)}
        />
        <Route
          path={KMS_ROUTES_URIS.kmsTerminate}
          Component={KmsTerminateModal}
          handle={getRouteTracking(['terminate', 'okms'], PageType.popup)}
        />
      </Route>
      <Route
        path={KMS_ROUTES_URIS.serviceKeys}
        Component={ServiceKeyList}
        handle={getRouteTracking(['service-key'], PageType.listing)}
      >
        <Route
          path={`${KMS_ROUTES_URIS.serviceKeyDeactivate}/${KMS_URL_PARAMS.keyId}`}
          Component={ServiceKeyDeactivateModal}
          handle={getRouteTracking(['deactivate', 'service-key'], PageType.listing)}
        />
      </Route>
      <Route
        path={KMS_ROUTES_URIS.credentials}
        Component={CredentialsList}
        handle={getRouteTracking(['credential'], PageType.listing)}
      >
        <Route
          path={`${KMS_ROUTES_URIS.credentialDelete}/${KMS_URL_PARAMS.credentialId}`}
          Component={CredentialsListDeleteModal}
          handle={getRouteTracking(['delete', 'credential'], PageType.popup)}
        />
      </Route>
      <Route
        path={`${KMS_ROUTES_URIS.kmsLogs}/*`}
        Component={KmsLogs}
        handle={getRouteTracking(['logs'], PageType.dashboard)}
      />
    </Route>
    <Route
      path={`${KMS_URL_PARAMS.okmsId}/${KMS_ROUTES_URIS.serviceKeys}/${KMS_ROUTES_URIS.serviceKeyCreate}`}
      Component={ServiceKeyCreate}
      handle={getRouteTracking(['create', 'service-key'], PageType.funnel)}
    />
    <Route
      path={`${KMS_URL_PARAMS.okmsId}/${KMS_ROUTES_URIS.credentials}/${KMS_ROUTES_URIS.credentialCreate}`}
      Component={CredentialsCreate}
      handle={getRouteTracking(['create', 'credential'], PageType.funnel)}
    >
      <Route
        path={KMS_ROUTES_URIS.credentialCreateAddUserModal}
        Component={CredentialsCreateUserListModal}
      />
      <Route
        path={KMS_ROUTES_URIS.credentialCreateAddGroupModal}
        Component={CredentialsCreateGroupListModal}
      />
      <Route
        path={KMS_ROUTES_URIS.credentialCreateAddServiceAccountModal}
        Component={CredentialsCreateServiceAccountListModal}
      />
    </Route>
    <Route
      path={`${KMS_URL_PARAMS.okmsId}/${KMS_ROUTES_URIS.credentials}/${KMS_URL_PARAMS.credentialId}`}
      Component={CredentialsDashboard}
    >
      <Route
        path={''}
        Component={CredentialsGeneralInformations}
        handle={getRouteTracking(['credential'], PageType.dashboard)}
      >
        <Route
          path={KMS_ROUTES_URIS.credentialDelete}
          Component={CredentialsDashboardDeleteModal}
          handle={getRouteTracking(['delete', 'credential'], PageType.popup)}
        />
      </Route>
      <Route
        path={KMS_ROUTES_URIS.credentialIdentities}
        Component={CredentialsIdentities}
        handle={getRouteTracking(['identity'], PageType.listing)}
      />
    </Route>
    <Route
      path={`${KMS_URL_PARAMS.okmsId}/${KMS_ROUTES_URIS.serviceKeys}/${KMS_URL_PARAMS.keyId}`}
      Component={ServiceKeyDashboard}
      handle={getRouteTracking(['service-key'], PageType.dashboard)}
    >
      <Route
        path={KMS_ROUTES_URIS.serviceKeyEditName}
        Component={ServiceKeyRenameModal}
        handle={getRouteTracking(['rename', 'service-key'], PageType.popup)}
      />
      <Route
        path={KMS_ROUTES_URIS.serviceKeyDeactivate}
        Component={ServiceKeyDeactivateModal}
        handle={getRouteTracking(['deactivate', 'service-key'], PageType.popup)}
      />
    </Route>
  </Route>
);
