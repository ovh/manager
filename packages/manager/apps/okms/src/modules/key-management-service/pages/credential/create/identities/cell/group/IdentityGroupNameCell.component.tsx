import React from 'react';
import { DataGridTextCell } from '@ovh-ux/manager-react-components';
import { IdentityGroup } from '@key-management-service/types/identity.type';

const IdentityGroupNameCell = (group: IdentityGroup) => {
  return <DataGridTextCell>{group.name}</DataGridTextCell>;
};

export default IdentityGroupNameCell;
