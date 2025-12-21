import { IdentityObject, IdentityType } from '@key-management-service/types/identity.type';

import { decodeIdentity } from './decodeIdentities';

interface IfilterIdentities {
  identities: string[];
  type: IdentityType;
}

const isIdentityOfType =
  (type: IdentityType) =>
  (i: IdentityObject | null | undefined): i is IdentityObject =>
    i != null && i.type === type;

export const filterIdentities = ({ identities, type }: IfilterIdentities) => {
  return identities.map(decodeIdentity).filter(isIdentityOfType(type));
};
