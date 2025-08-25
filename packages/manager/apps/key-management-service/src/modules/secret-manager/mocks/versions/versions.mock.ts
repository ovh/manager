import {
  SecretVersion,
  SecretVersionWithData,
} from '@secret-manager/types/secret.type';

export const versionDeletedMock: SecretVersion = {
  id: 1,
  createdAt: '2023-01-15T08:30:45Z',
  state: 'DELETED',
};

export const versionDeactivatedMock: SecretVersion = {
  id: 2,
  createdAt: '2023-01-16T08:30:45Z',
  state: 'DEACTIVATED',
  deactivatedAt: '2023-01-17T08:30:45Z',
};

export const versionActiveMock: SecretVersion = {
  id: 3,
  createdAt: '2023-01-18T08:30:45Z',
  state: 'ACTIVE',
  deactivatedAt: '2023-01-19T08:30:45Z',
};

export const versionsMock: SecretVersion[] = [
  versionActiveMock,
  versionDeactivatedMock,
  versionDeletedMock,
];

export const getVersionMockWithData = (
  version: SecretVersion,
): SecretVersionWithData => ({
  ...version,
  data: { a: 'json' },
});

export const versionsMockwithData: SecretVersionWithData[] = versionsMock.map(
  (version) => getVersionMockWithData(version),
);
