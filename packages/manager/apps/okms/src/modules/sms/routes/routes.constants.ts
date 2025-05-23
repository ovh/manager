const URIS = {
  root: 'secret-management-service',
  onboarding: 'onboarding',
  versions: 'versions',
  secrets: 'secrets',
  create: 'create',
};

const URLS = {
  smsRoot: `/${URIS.root}`,
  smsOnboarding: `/${URIS.root}/${URIS.onboarding}`,
  secretCreate: `/${URIS.root}/${URIS.create}`,
  secretListing: (domainId: string) =>
    `/${URIS.root}/${domainId}/${URIS.secrets}`,
  secretDashboard: (domainId: string, secretId: string) =>
    `/${URIS.root}/${domainId}/${URIS.secrets}/${secretId}`,
};

export const SMS_URL_PARAMS = {
  domainId: ':domainId',
  secretId: ':secretId',
};

export const SMS_ROUTES_URIS = URIS;
export const SMS_ROUTES_URLS = URLS;
