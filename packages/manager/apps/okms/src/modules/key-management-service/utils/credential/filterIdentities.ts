import { IdentityObject, IdentityType } from '@key-management-service/types/identity.type';

import { filterFalsy } from '@/common/utils/tools/filterFalsy';

import { decodeIdentity } from './decodeIdentities';

interface IfilterIdentities {
  identities: string[];
  type: IdentityType;
}

export const filterIdentities = ({ identities, type }: IfilterIdentities) => {
  const decodedIdentities = filterFalsy(
    identities.map((i) => decodeIdentity(i)).filter((i): i is IdentityObject => i?.type === type),
  );

  return decodedIdentities;
};
