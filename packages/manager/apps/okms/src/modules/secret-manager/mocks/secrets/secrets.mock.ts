import { CreateSecretResponse } from '@secret-manager/data/api/secrets';
import { Secret } from '@secret-manager/types/secret.type';

export const mockSecret1: Secret = {
  path: 'secret/1',
  version: {
    id: 1,
    createdAt: '2023-01-15T08:30:45Z',
    deactivatedAt: '',
    state: 'ACTIVE',
  },
  metadata: {
    casRequired: true,
    createdAt: '2023-01-15T08:30:45Z',
    updatedAt: '2023-01-15T20:30:45Z',
    currentVersion: 1,
    customMetadata: {
      environment: 'production',
      application: 'payment-service',
    },
    deactivateVersionAfter: '10d10h10m10s',
    oldestVersion: 1,
    maxVersions: 5,
  },
  iam: {
    id: '1',
    displayName: 'api-key',
    urn: 'urn:1',
  },
};

export const mockSecret2: Secret = {
  path: 'secret/2',
  version: {
    id: 3,
    createdAt: '2023-04-22T14:15:30Z',
    deactivatedAt: '',
    state: 'DEACTIVATED',
  },
  metadata: {
    casRequired: true,
    createdAt: '2023-04-22T14:15:30Z',
    updatedAt: '2023-04-22T19:15:30Z',
    currentVersion: 3,
    customMetadata: {
      environment: 'staging',
      application: 'user-database',
      owner: 'db-team',
    },
    deactivateVersionAfter: '20d20h20m20s',
    oldestVersion: 1,
    maxVersions: 10,
  },
  iam: {
    id: '2',
    displayName: 'database-password',
    urn: 'urn:2',
  },
};

export const mockSecret3: Secret = {
  path: 'secret/3',
  version: {
    id: 3,
    createdAt: '2023-04-22T14:15:30Z',
    deactivatedAt: '',
    state: 'DELETED',
  },
  metadata: {
    casRequired: true,
    createdAt: '2023-04-22T14:15:30Z',
    updatedAt: '2023-04-22T19:15:30Z',
    currentVersion: 3,
    customMetadata: {
      environment: 'staging',
      application: 'user-database',
      owner: 'db-team',
    },
    deactivateVersionAfter: '20d20h20m20s',
    oldestVersion: 1,
    maxVersions: 10,
  },
  iam: {
    id: '2',
    displayName: 'database-password',
    urn: 'urn:2',
  },
};

export const createSecretResponseMock: CreateSecretResponse = {
  path: 'new/secret',
  metadata: {
    casRequired: true,
    createdAt: '2022-11-10T09:45:12Z',
    updatedAt: '2023-04-22T14:15:30Z',
    currentVersion: 1,
    customMetadata: {
      environment: 'staging',
      application: 'user-database',
      owner: 'db-team',
    },
    deactivateVersionAfter: '2024-04-22T14:15:30Z',
    oldestVersion: 1,
    maxVersions: 10,
  },
};

const mockCreatedSecret: Secret = {
  ...createSecretResponseMock,
  version: {
    id: 1,
    createdAt: '2023-01-15T08:30:45Z',
    deactivatedAt: '',
    state: 'ACTIVE',
  },
  iam: {
    id: '2',
    displayName: 'createdSecret',
    urn: 'urn:2',
  },
};

export const secretListMock: Secret[] = [
  mockSecret1,
  mockSecret2,
  mockSecret3,
  mockCreatedSecret,
];
