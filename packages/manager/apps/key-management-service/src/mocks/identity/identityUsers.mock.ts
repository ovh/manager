import { IdentityUser, IdentityStatus } from '@/types/identity.type';

export const identityUsers: IdentityUser[] = [
  {
    creation: '2024-11-14T11:24:15.678357+01:00',
    description: '',
    email: 'user-id-1@corp.ovh.com',
    group: 'ADMIN',
    lastUpdate: '2024-11-15T10:34:17.024661+01:00',
    login: 'user-id-1',
    passwordLastUpdate: '2024-11-14T11:24:15.737298+01:00',
    status: IdentityStatus.ok,
    urn: 'urn:v1:eu:identity:user:ls148374-ovh/user-id-1',
  },
  {
    creation: '2024-11-14T11:24:15.678357+01:00',
    description: '',
    email: 'user-id-2@corp.ovh.com',
    group: 'ADMIN',
    lastUpdate: '2024-11-15T10:34:17.024661+01:00',
    login: 'user-id-2',
    passwordLastUpdate: '2024-11-14T11:24:15.737298+01:00',
    status: IdentityStatus.ok,
    urn: 'urn:v1:eu:identity:user:ls148374-ovh/user-id-2',
  },
  {
    creation: '2024-11-14T11:24:15.678357+01:00',
    description: '',
    email: 'user-id-3@corp.ovh.com',
    group: 'ADMIN',
    lastUpdate: '2024-11-15T10:34:17.024661+01:00',
    login: 'user-id-3',
    passwordLastUpdate: '2024-11-14T11:24:15.737298+01:00',
    status: IdentityStatus.ok,
    urn: 'urn:v1:eu:identity:user:ls148374-ovh/user-id-3',
  },
];
