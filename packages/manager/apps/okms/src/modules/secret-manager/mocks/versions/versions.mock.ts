import { SecretVersion } from '@secret-manager/types/secret.type';
import { CreateSecretVersionResponse } from '@secret-manager/data/api/secretVersions';

export const versionActiveMock: SecretVersion = {
  id: 1,
  createdAt: '2023-01-18T08:30:45Z',
  state: 'ACTIVE',
};

export const versionDeactivatedMock: SecretVersion = {
  id: 2,
  createdAt: '2023-01-16T08:30:45Z',
  state: 'DEACTIVATED',
  deactivatedAt: '2023-01-17T08:30:45Z',
};

export const versionDeletedMock: SecretVersion = {
  id: 3,
  createdAt: '2023-01-15T08:30:45Z',
  state: 'DELETED',
  deactivatedAt: '2023-01-17T08:30:45Z',
};

export const versionListMock: SecretVersion[] = [
  versionActiveMock,
  versionDeactivatedMock,
  versionDeletedMock,
];

export const createVersionResponseMock: CreateSecretVersionResponse = {
  id: 1,
  state: 'ACTIVE',
  createdAt: '2023-01-18T08:30:45Z',
};
