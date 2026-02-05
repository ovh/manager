const URIS = {
  root: 'service-keys',
  onboarding: 'onboarding',
};

const URLS = {
  root: `/${URIS.root}`,
  onboarding: `/${URIS.root}/${URIS.onboarding}`,
  serviceKeyList: (okmsId: string) => `/${URIS.root}/${okmsId}`,
  serviceKeyDashboard: (okmsId: string, keyId: string) => `/${URIS.root}/${okmsId}/${keyId}`,
};

export const SERVICE_KEYS_URL_PARAMS = {
  okmsId: ':okmsId',
  keyId: ':keyId',
};

export const SERVICE_KEYS_ROUTES_URIS = URIS;
export const SERVICE_KEYS_ROUTES_URLS = URLS;
