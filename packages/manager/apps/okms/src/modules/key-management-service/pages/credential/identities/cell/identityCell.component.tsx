import { IdentityObject } from '@key-management-service/types/identity.type';

import { DataGridTextCell } from '@ovh-ux/manager-react-components';

export const IdentityIdCell = (identity: IdentityObject) => {
  return <DataGridTextCell>{identity.id}</DataGridTextCell>;
};

export const IdentityUrnCell = (identity: IdentityObject) => {
  return <DataGridTextCell>{identity.urn}</DataGridTextCell>;
};

export const IdentityAccountCell = (identity: IdentityObject) => {
  return <DataGridTextCell>{identity.account}</DataGridTextCell>;
};
