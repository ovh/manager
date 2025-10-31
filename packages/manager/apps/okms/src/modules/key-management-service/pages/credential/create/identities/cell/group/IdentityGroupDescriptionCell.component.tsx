import React from 'react';
import { DataGridTextCell } from '@ovh-ux/manager-react-components';
import { IdentityGroup } from '@key-management-service/types/identity.type';

const IdentityGroupDescriptionCell = (group: IdentityGroup) => {
  return <DataGridTextCell>{group.description}</DataGridTextCell>;
};

export default IdentityGroupDescriptionCell;
