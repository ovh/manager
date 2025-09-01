import { describe, expect, test } from 'vitest';
import { filterIdentities } from './filterIdentities';
import { IdentityType } from '@/types/identity.type';

const userIdentities: string[] = [
  'urn:v1:eu:identity:user:xx111-ovh/user-1',
  'urn:v1:eu:identity:user:xx111-ovh/user-2',
];

const groupIdentities: string[] = [
  'urn:v1:eu:identity:group:xx111-ovh/usergroup-1',
  'urn:v1:eu:identity:group:xx111-ovh/usergroup-2',
  'urn:v1:eu:identity:group:xx111-ovh/usergroup-3',
];

const credentialIdentities: string[] = [
  'urn:v1:eu:identity:credential:xx111-ovh/service-account-1',
  'urn:v1:eu:identity:credential:xx111-ovh/service-account-2',
  'urn:v1:eu:identity:credential:xx111-ovh/service-account-3',
  'urn:v1:eu:identity:credential:xx111-ovh/service-account-4',
];

const accountIdentities = [
  'urn:v1:eu:identity:account:xx111-ovh',
  'urn:v1:eu:identity:account:xx222-ovh',
  'urn:v1:eu:identity:account:xx333-ovh',
  'urn:v1:eu:identity:account:xx444-ovh',
  'urn:v1:eu:identity:account:xx555-ovh',
];

const allIdentities = [
  ...userIdentities,
  ...groupIdentities,
  ...credentialIdentities,
  ...accountIdentities,
];

describe('filterIdentities test suite', () => {
  const useCases: {
    identityType: IdentityType;
    identityNumber: number;
    identities: string[];
  }[] = [
    {
      identityType: 'account',
      identityNumber: accountIdentities.length,
      identities: allIdentities,
    },
    {
      identityType: 'credential',
      identityNumber: credentialIdentities.length,
      identities: allIdentities,
    },
    {
      identityType: 'group',
      identityNumber: groupIdentities.length,
      identities: allIdentities,
    },
    {
      identityType: 'user',
      identityNumber: userIdentities.length,
      identities: allIdentities,
    },
    {
      identityType: 'account',
      identityNumber: 0,
      identities: [],
    },
    {
      identityType: 'credential',
      identityNumber: 0,
      identities: [],
    },
    {
      identityType: 'group',
      identityNumber: 0,
      identities: [],
    },
    {
      identityType: 'user',
      identityNumber: 0,
      identities: [],
    },
  ];

  test.each(useCases)(
    'should only return $identityNumber identities of type $identityType',
    ({ identityType, identityNumber, identities }) => {
      // given type, identityNumber and identities

      // when
      const filteredIdentities = filterIdentities({
        identities,
        type: identityType,
      });

      // then
      expect(filteredIdentities).toHaveLength(identityNumber);

      for (let i = 0; i < filteredIdentities.length; i += 1) {
        expect(filteredIdentities[i]).toHaveProperty('type', identityType);
      }
    },
  );
});
