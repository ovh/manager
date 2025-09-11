const URIS = {
  root: '/',
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
  kmsOnboarding: URIS.kmsOnboarding,
  kmsListing: URIS.root,
  kmsListingTerminate: (okmsId: string) => `/${URIS.kmsTerminate}/${okmsId}`,
  kmsCreate: `/${URIS.kmsCreate}`,
  kmsDashboard: (okmsId: string) => `/${okmsId}`,
  kmsDashboardTerminate: (okmsId: string) =>
    `/${URIS.root}/${okmsId}/${URIS.kmsTerminate}`,
  kmsEditName: (okmsId: string) => `/${okmsId}/${URIS.kmsEditName}`,
  kmsLogs: (okmsId: string) => `/${okmsId}/${URIS.kmsLogs}`,
  serviceKeyListing: (okmsId: string) => `/${okmsId}/${URIS.serviceKeys}`,
  serviceKeyListingDeactivate: (okmsId: string, serviceKeyId: string) =>
    `/${okmsId}/${URIS.serviceKeys}/deactivate/${serviceKeyId}`,
  serviceKeyDashboard: (okmsId: string, serviceKeyId: string) =>
    `/${okmsId}/${URIS.serviceKeys}/${serviceKeyId}`,
  serviceKeyDashboardDeactivate: (okmsId: string, serviceKeyId: string) =>
    `/${okmsId}/${URIS.serviceKeys}/${serviceKeyId}/deactivate`,
  serviceKeyEditName: (okmsId: string, serviceKeyId: string) =>
    `/${okmsId}/${URIS.serviceKeys}/${serviceKeyId}/${URIS.serviceKeyEditName}`,
  serviceKeyCreate: (okmsId: string) =>
    `/${okmsId}/${URIS.serviceKeys}/${URIS.serviceKeyCreate}`,
  credentialListing: (okmsId: string) => `/${okmsId}/${URIS.credentials}`,
  credentialDashboard: (okmsId: string, credentialId: string) =>
    `/${okmsId}/${URIS.credentials}/${credentialId}`,
  credentialDashboardDelete: (okmsId: string, credentialId: string) =>
    `/${okmsId}/${URIS.credentials}/${credentialId}/${URIS.credentialDelete}`,
  credentialIdentitiesList: (okmsId: string, credentialId: string) =>
    `/${okmsId}/${URIS.credentials}/${credentialId}/${URIS.credentialIdentities}`,
  credentialCreate: (okmsId: string) =>
    `/${okmsId}/${URIS.credentials}/${URIS.credentialCreate}`,
};

export const KMS_URL_PARAMS = {
  okmsId: ':okmsId',
  keyId: ':keyId',
  credentialId: ':credentialId',
};

export const KMS_ROUTES_URIS = URIS;
export const KMS_ROUTES_URLS = URLS;
