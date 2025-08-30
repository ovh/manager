import { encodeSecretPath } from '@/modules/secret-manager/utils/secretPath';

const URIS = {
  root: 'secret-manager',
  onboarding: 'onboarding',
  region: 'region',
  versions: 'versions',
  create: 'create',
  createVersion: 'create-version',
  order: 'order',
  value: 'value',
  delete: 'delete',
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

  secretListingDrawerValue: (domainId: string, secretPath: string) =>
    `/${URIS.root}/${domainId}/${URIS.value}/${encodeSecretPath(secretPath)}`,

  secretListingDrawerCreateVersion: (domainId: string, secretPath: string) =>
    `/${URIS.root}/${domainId}/${URIS.createVersion}/${encodeSecretPath(
      secretPath,
    )}`,

  secretDashboard: (domainId: string, secretPath: string) =>
    `/${URIS.root}/${domainId}/${encodeSecretPath(secretPath)}`,

  secretDashboardDrawerValue: (domainId: string, secretPath: string) =>
    `/${URIS.root}/${domainId}/${encodeSecretPath(secretPath)}/${URIS.value}`,

  secretDashboardDrawerCreateVersion: (domainId: string, secretPath: string) =>
    `/${URIS.root}/${domainId}/${encodeSecretPath(secretPath)}/${
      URIS.createVersion
    }`,

  secretVersions: (domainId: string, secretPath: string) =>
    `/${URIS.root}/${domainId}/${encodeSecretPath(secretPath)}/${
      URIS.versions
    }`,

  secretVersionsDrawerCreateVersion: (domainId: string, secretPath: string) =>
    `/${URIS.root}/${domainId}/${encodeSecretPath(secretPath)}/${
      URIS.versions
    }/${URIS.create}`,

  secretVersionsModalDeleteVersion: (
    domainId: string,
    secretPath: string,
    versionId: number,
  ) =>
    `/${URIS.root}/${domainId}/${encodeSecretPath(secretPath)}/${
      URIS.versions
    }/${versionId}/${URIS.delete}`,
};

export const SECRET_MANAGER_URL_PARAMS = {
  region: ':region',
  domainId: ':domainId',
  secretPath: ':secretPath',
  versionId: ':versionId',
};

export const SECRET_MANAGER_SEARCH_PARAMS = {
  domainId: 'domainId',
};

export const SECRET_MANAGER_ROUTES_URIS = URIS;
export const SECRET_MANAGER_ROUTES_URLS = URLS;

export type LocationPathParams = {
  [K in keyof typeof SECRET_MANAGER_URL_PARAMS]: string;
};
