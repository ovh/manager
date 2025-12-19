import { IdentityType } from '@key-management-service/types/identity.type';

import { decodeIdentity } from './decodeIdentities';

interface IfilterIdentities {
  identities: string[];
  type: IdentityType;
}

export const filterIdentities = ({ identities, type }: IfilterIdentities) => {
  const decodedIdentities = identities
    .map((i) => decodeIdentity(i))
    .filter((i) => i?.type === type)
    .filter((i) => i !== null);

  return decodedIdentities;
};
