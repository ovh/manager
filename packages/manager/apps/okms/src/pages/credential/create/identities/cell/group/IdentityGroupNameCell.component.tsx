import React from 'react';
import { DataGridTextCell } from '@ovh-ux/manager-react-components';
import { IdentityGroup } from '@/types/identity.type';

const IdentityGroupNameCell = (group: IdentityGroup) => {
  return <DataGridTextCell>{group.name}</DataGridTextCell>;
};

export default IdentityGroupNameCell;
