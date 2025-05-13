import { IdentityObject } from '@/types/identity.type';
import { decodeIdentity } from './decodeIdentities';

describe('decodeIdentities test suite', () => {
  const useCases: { urn: string; identityObject: IdentityObject }[] = [
    {
      urn: 'urn:v1:eu:identity:user:xx111-ovh/user-1',
      identityObject: {
        version: 1,
        region: 'eu',
        entity: 'identity',
        type: 'user',
        account: 'xx111-ovh',
        id: 'user-1',
        urn: 'urn:v1:eu:identity:user:xx111-ovh/user-1',
      },
    },
    {
      urn: 'urn:v2:ca:identity:group:aa123-ovh/user-group-1',
      identityObject: {
        version: 2,
        region: 'ca',
        entity: 'identity',
        type: 'group',
        account: 'aa123-ovh',
        id: 'user-group-1',
        urn: 'urn:v2:ca:identity:group:aa123-ovh/user-group-1',
      },
    },
    {
      urn: 'urn:v3:us:identity:credential:bb234-ovh/credential-1',
      identityObject: {
        version: 3,
        region: 'us',
        entity: 'identity',
        type: 'credential',
        account: 'bb234-ovh',
        id: 'credential-1',
        urn: 'urn:v3:us:identity:credential:bb234-ovh/credential-1',
      },
    },
    {
      urn: 'urn:v4:labeu:identity:account:cc345-ovh',
      identityObject: {
        version: 4,
        region: 'labeu',
        entity: 'identity',
        type: 'account',
        account: 'cc345-ovh',
        id: undefined,
        urn: 'urn:v4:labeu:identity:account:cc345-ovh',
      },
    },
  ];

  test.each(useCases)(
    'should return $identityObject for $urn',
    ({ urn, identityObject }) => {
      // given urn and identityObject

      // when
      const decodedIdentity = decodeIdentity(urn);

      // then
      expect(decodedIdentity).toStrictEqual(identityObject);
    },
  );
});
