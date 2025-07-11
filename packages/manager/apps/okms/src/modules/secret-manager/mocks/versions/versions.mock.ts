import { SecretVersion } from '@secret-manager/types/secret.type';

export const versionsMock: SecretVersion[] = [
  { id: 1, createdAt: '2023-01-15T08:30:45Z', state: 'ACTIVE' },
  {
    id: 2,
    createdAt: '2023-01-16T08:30:45Z',
    state: 'DEACTIVATED',
    deactivatedAt: '2023-01-17T08:30:45Z',
  },
  {
    id: 3,
    createdAt: '2023-01-18T08:30:45Z',
    state: 'DELETED',
    deactivatedAt: '2023-01-19T08:30:45Z',
  },
];
