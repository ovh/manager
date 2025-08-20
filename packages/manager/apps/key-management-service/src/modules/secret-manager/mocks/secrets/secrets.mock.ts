import { CreateSecretResponse } from '@secret-manager/data/api/secrets';
import { Secret, SecretWithData } from '@secret-manager/types/secret.type';
import { getVersionMockWithData } from '../versions/versions.mock';

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

export const mockSecret1WithData: SecretWithData = {
  ...mockSecret1,
  version: getVersionMockWithData(mockSecret1.version),
};

export const mockSecret2: Secret = {
  path: 'a/path',
  version: {
    id: 3,
    createdAt: '2023-04-22T14:15:30Z',
    deactivatedAt: '',
    state: 'ACTIVE',
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

export const mockSecret2WithData: SecretWithData = {
  ...mockSecret2,
  version: getVersionMockWithData(mockSecret2.version),
};

export const secretsMock: Secret[] = [mockSecret1, mockSecret2];
export const secretsMockWithData: Secret[] = [
  mockSecret1WithData,
  mockSecret2WithData,
];

export const createSecretResponseMock: CreateSecretResponse = {
  path: 'a/path',
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
