/**
 * KEY MANAGEMENT SERVICE ROUTES
 */
export const KMS_ROUTES_URIS = {
  root: 'key-management-service',
  onboarding: 'onboarding',
  terminateOkms: 'terminate',
  createKeyManagementService: 'create',
  okmsId: ':okmsId',
  okmsUpdateName: 'update-name',
  keys: 'keys',
  keyId: ':keyId',
  logs: 'logs',
  createKmsServiceKey: 'create',
  serviceKeyEditName: 'edit-name',
  serviceKeyDeactivate: 'deactivate',
  credentials: 'credentials',
  createCredential: 'create',
  createCredentialAddUserModal: 'add-users',
  createCredentialAddGroupsModal: 'add-groups',
  createCredentialAddServiceAccountModal: 'add-service-account',
  credentialId: ':credentialId',
  credentialIdentities: 'identities',
  credentialDelete: 'delete',
};

export const KMS_ROUTES_URLS = {
  kmsListing: `/${KMS_ROUTES_URIS.root}`,
  kmsCreate: `/${KMS_ROUTES_URIS.root}/${KMS_ROUTES_URIS.createKeyManagementService}`,
  kmsDashboard: (domainId: string) => `/${KMS_ROUTES_URIS.root}/${domainId}`,
  serviceKeyListing: (domainId: string) =>
    `/${KMS_ROUTES_URIS.root}/${domainId}/${KMS_ROUTES_URIS.keys}`,
  serviceKeyDashboard: (domainId: string, serviceKeyId: string) =>
    `/${KMS_ROUTES_URIS.root}/${domainId}/${KMS_ROUTES_URIS.keys}/${serviceKeyId}`,
};

/**
 * SECRET MANAGEMENT SERVICE ROUTES
 */
export const SMS_ROUTES_URIS = {
  root: 'secret-management-service',
  domainId: ':domainId',
  versions: 'versions',
  secrets: 'secrets',
  secretId: ':secretId',
};

export const SMS_ROUTES_URLS = {
  // Secrets urls pages
};
