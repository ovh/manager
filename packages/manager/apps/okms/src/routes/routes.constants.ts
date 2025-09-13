const URIS = {
  root: 'key-management-service',
  kmsOnboarding: 'onboarding',
  kmsTerminate: 'terminate',
  kmsCreate: 'create',
  kmsEditName: 'edit-name',
  kmsLogs: 'logs',
  serviceKeys: 'keys',
  serviceKeyCreate: 'create',
  serviceKeyEditName: 'edit-name',
  serviceKeyDeactivate: 'deactivate',
  credentials: 'credentials',
  credentialCreate: 'create',
  credentialCreateAddUserModal: 'add-user',
  credentialCreateAddGroupModal: 'add-group',
  credentialCreateAddServiceAccountModal: 'add-service-account',
  credentialIdentities: 'identities',
  credentialDelete: 'delete',
};

const URLS = {
  kmsOnboarding: `/${URIS.root}/${URIS.kmsOnboarding}`,
  kmsListing: `/${URIS.root}`,
  kmsListingTerminate: (domainId: string) =>
    `/${URIS.root}/${URIS.kmsTerminate}/${domainId}`,
  kmsCreate: `/${URIS.root}/${URIS.kmsCreate}`,
  kmsDashboard: (domainId: string) => `/${URIS.root}/${domainId}`,
  kmsDashboardTerminate: (domainId: string) =>
    `/${URIS.root}/${URIS.root}/${domainId}/${URIS.kmsTerminate}`,
  kmsEditName: (domainId: string) =>
    `/${URIS.root}/${domainId}/${URIS.kmsEditName}`,
  kmsLogs: (domainId: string) => `/${URIS.root}/${domainId}/${URIS.kmsLogs}`,
  serviceKeyListing: (domainId: string) =>
    `/${URIS.root}/${domainId}/${URIS.serviceKeys}`,
  serviceKeyListingDeactivate: (domainId: string, serviceKeyId: string) =>
    `/${URIS.root}/${domainId}/${URIS.serviceKeys}/deactivate/${serviceKeyId}`,
  serviceKeyDashboard: (domainId: string, serviceKeyId: string) =>
    `/${URIS.root}/${domainId}/${URIS.serviceKeys}/${serviceKeyId}`,
  serviceKeyDashboardDeactivate: (domainId: string, serviceKeyId: string) =>
    `/${URIS.root}/${domainId}/${URIS.serviceKeys}/${serviceKeyId}/deactivate`,
  serviceKeyEditName: (domainId: string, serviceKeyId: string) =>
    `/${URIS.root}/${domainId}/${URIS.serviceKeys}/${serviceKeyId}/${URIS.serviceKeyEditName}`,
  serviceKeyCreate: (domainId: string) =>
    `/${URIS.root}/${domainId}/${URIS.serviceKeys}/${URIS.serviceKeyCreate}`,
  credentialListing: (domainId: string) =>
    `/${URIS.root}/${domainId}/${URIS.credentials}`,
  credentialDashboard: (domainId: string, credentialId: string) =>
    `/${URIS.root}/${domainId}/${URIS.credentials}/${credentialId}`,
  credentialDashboardDelete: (domainId: string, credentialId: string) =>
    `/${URIS.root}/${domainId}/${URIS.credentials}/${credentialId}/${URIS.credentialDelete}`,
  credentialIdentitiesList: (domainId: string, credentialId: string) =>
    `/${URIS.root}/${domainId}/${URIS.credentials}/${credentialId}/${URIS.credentialIdentities}`,
  credentialCreate: (domainId: string) =>
    `/${URIS.root}/${domainId}/${URIS.credentials}/${URIS.credentialCreate}`,
};

export const KMS_URL_PARAMS = {
  okmsId: ':okmsId',
  keyId: ':keyId',
  credentialId: ':credentialId',
};

export const KMS_ROUTES_URIS = URIS;
export const KMS_ROUTES_URLS = URLS;
