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
  kmsListingTerminate: (okmsId: string) =>
    `/${URIS.root}/${URIS.kmsTerminate}/${okmsId}`,
  kmsCreate: `/${URIS.root}/${URIS.kmsCreate}`,
  kmsDashboard: (okmsId: string) => `/${URIS.root}/${okmsId}`,
  kmsDashboardTerminate: (okmsId: string) =>
    `/${URIS.root}/${okmsId}/${URIS.kmsTerminate}`,
  kmsEditName: (okmsId: string) =>
    `/${URIS.root}/${okmsId}/${URIS.kmsEditName}`,
  kmsLogs: (okmsId: string) => `/${URIS.root}/${okmsId}/${URIS.kmsLogs}`,
  serviceKeyListing: (okmsId: string) =>
    `/${URIS.root}/${okmsId}/${URIS.serviceKeys}`,
  serviceKeyListingDeactivate: (okmsId: string, serviceKeyId: string) =>
    `/${URIS.root}/${okmsId}/${URIS.serviceKeys}/deactivate/${serviceKeyId}`,
  serviceKeyDashboard: (okmsId: string, serviceKeyId: string) =>
    `/${URIS.root}/${okmsId}/${URIS.serviceKeys}/${serviceKeyId}`,
  serviceKeyDashboardDeactivate: (okmsId: string, serviceKeyId: string) =>
    `/${URIS.root}/${okmsId}/${URIS.serviceKeys}/${serviceKeyId}/deactivate`,
  serviceKeyEditName: (okmsId: string, serviceKeyId: string) =>
    `/${URIS.root}/${okmsId}/${URIS.serviceKeys}/${serviceKeyId}/${URIS.serviceKeyEditName}`,
  serviceKeyCreate: (okmsId: string) =>
    `/${URIS.root}/${okmsId}/${URIS.serviceKeys}/${URIS.serviceKeyCreate}`,
  credentialListing: (okmsId: string) =>
    `/${URIS.root}/${okmsId}/${URIS.credentials}`,
  credentialDashboard: (okmsId: string, credentialId: string) =>
    `/${URIS.root}/${okmsId}/${URIS.credentials}/${credentialId}`,
  credentialDashboardDelete: (okmsId: string, credentialId: string) =>
    `/${URIS.root}/${okmsId}/${URIS.credentials}/${credentialId}/${URIS.credentialDelete}`,
  credentialIdentitiesList: (okmsId: string, credentialId: string) =>
    `/${URIS.root}/${okmsId}/${URIS.credentials}/${credentialId}/${URIS.credentialIdentities}`,
  credentialCreate: (okmsId: string) =>
    `/${URIS.root}/${okmsId}/${URIS.credentials}/${URIS.credentialCreate}`,
};

export const KMS_URL_PARAMS = {
  okmsId: ':okmsId',
  keyId: ':keyId',
  credentialId: ':credentialId',
};

export const KMS_ROUTES_URIS = URIS;
export const KMS_ROUTES_URLS = URLS;
