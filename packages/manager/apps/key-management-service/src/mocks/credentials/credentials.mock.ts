import {
  OkmsCredential,
  OkmsCredentialStatus,
} from '@/types/okmsCredential.type';

export const credentialMock: OkmsCredential[] = [
  {
    createdAt: '2024-10-23T15:24:23Z',
    expiredAt: '2024-10-23T15:24:23Z',
    fromCSR: true,
    id: '3d8a8d6a-e01a-4b0c-a1f1-f0cf67b4e88c',
    identityURNs: ['urn:v1:eu:identity:account:ok1-ovh'],
    name: 'credential-name',
    status: OkmsCredentialStatus.ready,
    description: 'credential description',
  },
];
