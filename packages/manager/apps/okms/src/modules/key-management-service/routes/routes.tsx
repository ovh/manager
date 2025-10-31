import { ErrorBoundary } from '@ovh-ux/manager-react-components';
import React from 'react';
import { getLogsRoute } from '@ovh-ux/logs-to-customer';
import { PageType } from '@ovh-ux/manager-react-shell-client';
import { Route } from 'react-router-dom';
import NotFound from '@key-management-service/pages/404';
import { KMS_ROUTES_URIS, KMS_URL_PARAMS } from './routes.constants';

export const COMMON_PATH = '/key-management-service';

// Kms
const KmsLayout = React.lazy(() =>
  import('@key-management-service/pages/layout'),
);
const KmsListing = React.lazy(() =>
  import('@key-management-service/pages/listing/KmsListing.page'),
);
const KmsTerminateModal = React.lazy(() =>
  import(
    '@key-management-service/pages/dashboard/generalInformations/terminate/TerminateKms/page'
  ),
);
const KmsCreate = React.lazy(() =>
  import('@key-management-service/pages/create/CreateKms.page'),
);
const KmsOnboarding = React.lazy(() =>
  import('@key-management-service/pages/onboarding/Onboarding'),
);
const KmsDashboard = React.lazy(() =>
  import('@key-management-service/pages/dashboard/KmsDashboard.page'),
);
const KmsGeneralInformations = React.lazy(() =>
  import(
    '@key-management-service/pages/dashboard/generalInformations/GeneralInformations.page'
  ),
);
const KmsLogs = React.lazy(() =>
  import('@key-management-service/pages/dashboard/logs/Logs.page'),
);
const KmsRenameModal = React.lazy(() =>
  import(
    '@key-management-service/pages/dashboard/generalInformations/updateName/OkmsNameUpdateModal.page'
  ),
);

// Service Key
const ServiceKeyDashboard = React.lazy(() =>
  import(
    '@key-management-service/pages/serviceKey/dashboard/ServiceKeyDashboard.page'
  ),
);
const ServiceKeyRenameModal = React.lazy(() =>
  import(
    '@key-management-service/pages/serviceKey/editServiceKeyNameModal/EditServiceKeyNameModal.page'
  ),
);
const ServiceKeyList = React.lazy(() =>
  import(
    '@key-management-service/pages/dashboard/serviceKeyList/ServiceKeyList.page'
  ),
);
const ServiceKeyDeactivateModal = React.lazy(() =>
  import(
    '@key-management-service/pages/serviceKey/deactivateServiceKeyModal/DeactivateServiceKeyModal.page'
  ),
);
const ServiceKeyCreate = React.lazy(() =>
  import('@key-management-service/pages/serviceKey/create/CreateKey.page'),
);

// Credentials
const CredentialsList = React.lazy(() =>
  import(
    '@key-management-service/pages/dashboard/credentialList/CredentialList.page'
  ),
);
const CredentialsListDeleteModal = React.lazy(() =>
  import(
    '@key-management-service/pages/dashboard/credentialList/delete/DeleteCredentialModal.page'
  ),
);
const CredentialsDashboard = React.lazy(() =>
  import('@key-management-service/pages/credential/Credential.page'),
);
const CredentialsGeneralInformations = React.lazy(() =>
  import(
    '@key-management-service/pages/credential/generalInformations/generalInformations.page'
  ),
);
const CredentialsDashboardDeleteModal = React.lazy(() =>
  import(
    '@key-management-service/pages/credential/generalInformations/delete/DeleteCredentialModal.page'
  ),
);
const CredentialsIdentities = React.lazy(() =>
  import('@key-management-service/pages/credential/identities/identities.page'),
);
const CredentialsCreate = React.lazy(() =>
  import(
    '@key-management-service/pages/credential/create/CreateCredential.page'
  ),
);
const CredentialsCreateUserListModal = React.lazy(() =>
  import(
    '@key-management-service/pages/credential/create/addUsers/CreateCredentialIdentityUserList.page'
  ),
);
const CredentialsCreateGroupListModal = React.lazy(() =>
  import(
    '@key-management-service/pages/credential/create/addGroups/CreateCredentialIdentityGroupList.page'
  ),
);
const CredentialsCreateServiceAccountListModal = React.lazy(() =>
  import(
    '@key-management-service/pages/credential/create/addServiceAccount/CreateCredentialIdentityServiceAccountList.page'
  ),
);

export default (
  <Route
    path={KMS_ROUTES_URIS.root}
    Component={KmsLayout}
    id={'kms-root'}
    errorElement={
      <ErrorBoundary
        redirectionApp="okms"
        isPreloaderHide={true}
        isRouteShellSync={true}
      />
    }
  >
    <Route
      path=""
      Component={KmsListing}
      handle={{
        tracking: {
          pageName: '',
          pageType: PageType.listing,
        },
      }}
    />
    <Route
      path={KMS_ROUTES_URIS.serviceKeyCreate}
      Component={KmsCreate}
      handle={{
        tracking: {
          pageName: 'create_kms',
          pageType: PageType.funnel,
        },
      }}
    />
    <Route
      path={KMS_ROUTES_URIS.kmsOnboarding}
      Component={KmsOnboarding}
      handle={{
        tracking: {
          pageName: 'onboarding',
          pageType: PageType.onboarding,
        },
      }}
    />
    <Route path={KMS_URL_PARAMS.okmsId} Component={KmsDashboard}>
      <Route
        path={''}
        Component={KmsGeneralInformations}
        handle={{
          tracking: {
            pageName: 'general_informations',
            pageType: PageType.dashboard,
          },
        }}
      >
        <Route
          path={KMS_ROUTES_URIS.kmsEditName}
          Component={KmsRenameModal}
          handle={{
            tracking: {
              pageName: 'rename_kms',
              pageType: PageType.popup,
            },
          }}
        />
        <Route
          path={KMS_ROUTES_URIS.kmsTerminate}
          Component={KmsTerminateModal}
          handle={{
            tracking: {
              pageName: 'terminate',
              pageType: PageType.popup,
            },
          }}
        />
      </Route>
      <Route
        path={KMS_ROUTES_URIS.serviceKeys}
        Component={ServiceKeyList}
        handle={{
          tracking: {
            pageName: 'encryption_keys',
            pageType: PageType.listing,
          },
        }}
      >
        <Route
          path={`${KMS_ROUTES_URIS.serviceKeyDeactivate}/${KMS_URL_PARAMS.keyId}`}
          Component={ServiceKeyDeactivateModal}
          handle={{
            tracking: {
              pageName: 'deactivate_encryption_key',
              pageType: PageType.popup,
            },
          }}
        />
      </Route>
      <Route
        path={KMS_ROUTES_URIS.credentials}
        Component={CredentialsList}
        handle={{
          tracking: {
            pageName: 'access_certificates',
            pageType: PageType.listing,
          },
        }}
      >
        <Route
          path={`${KMS_ROUTES_URIS.credentialDelete}/${KMS_URL_PARAMS.credentialId}`}
          Component={CredentialsListDeleteModal}
          handle={{
            tracking: {
              pageName: 'delete_access_certificate',
              pageType: PageType.popup,
            },
          }}
        />
      </Route>
      <Route path={`${KMS_ROUTES_URIS.kmsLogs}/*`} Component={KmsLogs}>
        {getLogsRoute()}
      </Route>
    </Route>
    <Route
      path={`${KMS_URL_PARAMS.okmsId}/${KMS_ROUTES_URIS.serviceKeys}/${KMS_ROUTES_URIS.serviceKeyCreate}`}
      Component={ServiceKeyCreate}
      handle={{
        tracking: {
          pageName: 'create_encryption_key',
          pageType: PageType.funnel,
        },
      }}
    />
    <Route
      path={`${KMS_URL_PARAMS.okmsId}/${KMS_ROUTES_URIS.credentials}/${KMS_ROUTES_URIS.credentialCreate}`}
      Component={CredentialsCreate}
      handle={{
        tracking: {
          pageName: 'create_access_certificate',
          pageType: PageType.funnel,
        },
      }}
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
        handle={{
          tracking: {
            pageName: 'details_access_certificate',
            pageType: PageType.dashboard,
          },
        }}
      >
        <Route
          path={KMS_ROUTES_URIS.credentialDelete}
          Component={CredentialsDashboardDeleteModal}
          handle={{
            tracking: {
              pageName: 'delete_access_certificate',
              pageType: PageType.popup,
            },
          }}
        />
      </Route>
      <Route
        path={KMS_ROUTES_URIS.credentialIdentities}
        Component={CredentialsIdentities}
        handle={{
          tracking: {
            pageName: 'details_identities',
            pageType: PageType.dashboard,
          },
        }}
      />
    </Route>
    <Route
      path={`${KMS_URL_PARAMS.okmsId}/${KMS_ROUTES_URIS.serviceKeys}/${KMS_URL_PARAMS.keyId}`}
      Component={ServiceKeyDashboard}
      handle={{
        tracking: {
          pageName: 'details_encryption_key',
          pageType: PageType.dashboard,
        },
      }}
    >
      <Route
        path={KMS_ROUTES_URIS.serviceKeyEditName}
        Component={ServiceKeyRenameModal}
        handle={{
          tracking: {
            pageName: 'rename_encryption_key',
            pageType: PageType.popup,
          },
        }}
      />
      <Route
        path={KMS_ROUTES_URIS.serviceKeyDeactivate}
        Component={ServiceKeyDeactivateModal}
        handle={{
          tracking: {
            pageName: 'deactivate_encryption_key',
            pageType: PageType.popup,
          },
        }}
      />
    </Route>
    <Route path={'*'} element={<NotFound />} />
  </Route>
);
