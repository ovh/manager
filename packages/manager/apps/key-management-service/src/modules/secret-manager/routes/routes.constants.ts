const URIS = {
  root: 'secret-manager',
  onboarding: 'onboarding',
  versions: 'versions',
  secrets: 'secrets',
  create: 'create',
};

const URLS = {
  secretManagerRoot: `/${URIS.root}`,
  secretManagerOnboarding: `/${URIS.root}/${URIS.onboarding}`,
  secretCreate: `/${URIS.root}/${URIS.create}`,
  secretListing: (domainId: string) =>
    `/${URIS.root}/${domainId}/${URIS.secrets}`,
  secretDashboard: (domainId: string, secretId: string) =>
    `/${URIS.root}/${domainId}/${URIS.secrets}/${secretId}`,
};

export const SECRET_MANAGER_URL_PARAMS = {
  domainId: ':domainId',
  secretId: ':secretId',
};

export const SECRET_MANAGER_ROUTES_URIS = URIS;
export const SECRET_MANAGER_ROUTES_URLS = URLS;
