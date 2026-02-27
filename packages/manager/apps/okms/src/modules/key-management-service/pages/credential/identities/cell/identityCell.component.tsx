import { IdentityObject } from '@key-management-service/types/identity.type';

import { Text } from '@ovhcloud/ods-react';

export const IdentityIdCell = (identity: IdentityObject) => {
  return <Text preset="span">{identity.id}</Text>;
};

export const IdentityUrnCell = (identity: IdentityObject) => {
  return <Text preset="span">{identity.urn}</Text>;
};

export const IdentityAccountCell = (identity: IdentityObject) => {
  return <Text preset="span">{identity.account}</Text>;
};
