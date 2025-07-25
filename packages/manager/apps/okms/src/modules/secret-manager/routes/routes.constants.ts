import { encodeSecretPath } from '@/modules/secret-manager/utils/secretPath';

const URIS = {
  root: 'secret-manager',
  onboarding: 'onboarding',
  region: 'region',
  versions: 'versions',
  create: 'create',
  order: 'order',
};

const URLS = {
  secretManagerRoot: `/${URIS.root}`,
  secretManagerOnboarding: `/${URIS.root}/${URIS.onboarding}`,
  secretCreate: `/${URIS.root}/${URIS.create}`,
  secretCreateOrderOkms: (regionId: string) =>
    `/${URIS.root}/${URIS.create}/${URIS.order}/${regionId}`,
  secretDomains: (regionId: string) =>
    `/${URIS.root}/${URIS.region}/${regionId}`,
  secretListing: (domainId: string) => `/${URIS.root}/${domainId}`,
  secretDashboard: (domainId: string, secretPath: string) =>
    `/${URIS.root}/${domainId}/${encodeSecretPath(secretPath)}`,
  secretVersions: (domainId: string, secretPath: string) =>
    `/${URIS.root}/${domainId}/${encodeSecretPath(secretPath)}/${
      URIS.versions
    }`,
};

export const SECRET_MANAGER_URL_PARAMS = {
  region: ':region',
  domainId: ':domainId',
  secretPath: ':secretPath',
};

export const SECRET_MANAGER_SEARCH_PARAMS = {
  domainId: 'domainId',
};

export const SECRET_MANAGER_ROUTES_URIS = URIS;
export const SECRET_MANAGER_ROUTES_URLS = URLS;
