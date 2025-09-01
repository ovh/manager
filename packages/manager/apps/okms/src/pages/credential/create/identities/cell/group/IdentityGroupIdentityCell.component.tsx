import React from 'react';
import { DataGridTextCell } from '@ovh-ux/manager-react-components';
import { IdentityGroup } from '@/types/identity.type';

const IdentityGroupIdentityCell = (group: IdentityGroup) => {
  return <DataGridTextCell>{group.urn}</DataGridTextCell>;
};

export default IdentityGroupIdentityCell;
