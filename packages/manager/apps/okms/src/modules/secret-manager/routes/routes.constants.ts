import { encodeSecretPath } from '@/modules/secret-manager/utils/secretPath';

const URIS = {
  root: 'secret-manager',
  onboarding: 'onboarding',
  region: 'region',
  versionList: 'versions',
  create: 'create',
  createVersion: 'create-version',
  editMetadata: 'edit-metadata',
  order: 'order',
  value: 'value',
  delete: 'delete',
  update: 'update',
  terminate: 'terminate',
  dashboard: 'dashboard',
  editSecretConfig: 'edit-secret-config',
};

const URLS = {
  root: `/${URIS.root}`,

  onboarding: `/${URIS.root}/${URIS.onboarding}`,

  createSecret: `/${URIS.root}/${URIS.create}`,

  createSecretOrderOkms: (regionId: string) =>
    `/${URIS.root}/${URIS.create}/${URIS.order}/${regionId}`,

  okmsList: (regionId: string) => `/${URIS.root}/${URIS.region}/${regionId}`,

  okmsDashboard: (okmsId: string) => `/${URIS.root}/${okmsId}/${URIS.dashboard}`,

  okmsUpdateNameModal: (okmsId: string) =>
    `/${URIS.root}/${okmsId}/${URIS.dashboard}/${URIS.update}`,

  okmsTerminateModal: (okmsId: string) =>
    `/${URIS.root}/${okmsId}/${URIS.dashboard}/${URIS.terminate}`,

  okmsUpdateSecretConfigDrawer: (okmsId: string) =>
    `/${URIS.root}/${okmsId}/${URIS.dashboard}/${URIS.editSecretConfig}`,

  secretList: (okmsId: string) => `/${URIS.root}/${okmsId}`,

  secretListDeleteSecretModal: (okmsId: string, secretPath: string) =>
    `/${URIS.root}/${okmsId}/${URIS.delete}/${encodeSecretPath(secretPath)}`,

  secretListSecretValueDrawer: (okmsId: string, secretPath: string) =>
    `/${URIS.root}/${okmsId}/${URIS.value}/${encodeSecretPath(secretPath)}`,

  secretListCreateVersionDrawer: (okmsId: string, secretPath: string) =>
    `/${URIS.root}/${okmsId}/${URIS.createVersion}/${encodeSecretPath(secretPath)}`,

  secret: (okmsId: string, secretPath: string) =>
    `/${URIS.root}/${okmsId}/${encodeSecretPath(secretPath)}`,

  secretSecretValueDrawer: (okmsId: string, secretPath: string) =>
    `/${URIS.root}/${okmsId}/${encodeSecretPath(secretPath)}/${URIS.value}`,

  secretCreateVersionDrawer: (okmsId: string, secretPath: string) =>
    `/${URIS.root}/${okmsId}/${encodeSecretPath(secretPath)}/${URIS.createVersion}`,

  secretEditMetadataDrawer: (okmsId: string, secretPath: string) =>
    `/${URIS.root}/${okmsId}/${encodeSecretPath(secretPath)}/${URIS.editMetadata}`,

  secretDeleteSecret: (okmsId: string, secretPath: string) =>
    `/${URIS.root}/${okmsId}/${encodeSecretPath(secretPath)}/${URIS.delete}`,

  versionList: (okmsId: string, secretPath: string) =>
    `/${URIS.root}/${okmsId}/${encodeSecretPath(secretPath)}/${URIS.versionList}`,

  versionListCreateVersionDrawer: (okmsId: string, secretPath: string) =>
    `/${URIS.root}/${okmsId}/${encodeSecretPath(secretPath)}/${URIS.versionList}/${URIS.create}`,

  versionListDeleteVersionModal: (okmsId: string, secretPath: string, versionId: number) =>
    `/${URIS.root}/${okmsId}/${encodeSecretPath(secretPath)}/${
      URIS.versionList
    }/${URIS.delete}/${versionId}`,

  versionListSecretValueDrawer: (okmsId: string, secretPath: string, versionId: number) =>
    `/${URIS.root}/${okmsId}/${encodeSecretPath(secretPath)}/${
      URIS.versionList
    }/${URIS.value}/${versionId}`,
};

export const SECRET_MANAGER_URL_PARAMS = {
  region: ':region',
  okmsId: ':okmsId',
  secretPath: ':secretPath',
  versionId: ':versionId',
};

export const SECRET_MANAGER_SEARCH_PARAMS = {
  okmsId: 'okmsId',
};

export const SECRET_MANAGER_ROUTES_URIS = URIS;
export const SECRET_MANAGER_ROUTES_URLS = URLS;
