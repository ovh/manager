import { Secret } from '@secret-manager/types/secret.type';

export const mockSecret1: Secret = {
  path: 'projects/acme-corp/secrets/api-key',
  version: {
    id: 1,
    createdAt: '2023-01-15T08:30:45Z',
    deactivatedAt: '',
    state: 'ACTIVE',
  },
  metadata: {
    casRequired: false,
    createdAt: '2023-01-15T08:30:45Z',
    updatedAt: '2023-01-15T08:30:45Z',
    currentVersion: 1,
    customMetadata: {
      environment: 'production',
      application: 'payment-service',
    },
    deactivateVersionAfter: '2024-01-15T08:30:45Z',
    oldestVersion: 1,
    maxVersions: 5,
  },
  iam: {
    id: '1',
    displayName: 'api-key',
    urn: 'urm:1',
  },
};

export const mockSecret2: Secret = {
  path: 'projects/acme-corp/secrets/database-password',
  version: {
    id: 3,
    createdAt: '2023-04-22T14:15:30Z',
    deactivatedAt: '',
    state: 'ACTIVE',
  },
  metadata: {
    casRequired: true,
    createdAt: '2022-11-10T09:45:12Z',
    updatedAt: '2023-04-22T14:15:30Z',
    currentVersion: 3,
    customMetadata: {
      environment: 'staging',
      application: 'user-database',
      owner: 'db-team',
    },
    deactivateVersionAfter: '2024-04-22T14:15:30Z',
    oldestVersion: 1,
    maxVersions: 10,
  },
  iam: {
    id: '2',
    displayName: 'database-password',
    urn: 'urm:2',
  },
};

export const secretsMock: Secret[] = [mockSecret1, mockSecret2];
