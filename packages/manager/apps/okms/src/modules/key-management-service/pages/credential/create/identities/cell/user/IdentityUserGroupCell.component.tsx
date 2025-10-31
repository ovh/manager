import React from 'react';
import { DataGridTextCell } from '@ovh-ux/manager-react-components';
import { IdentityUser } from '@key-management-service/types/identity.type';

const IdentityUserGroupCell = (user: IdentityUser) => {
  return <DataGridTextCell>{user.group}</DataGridTextCell>;
};

export default IdentityUserGroupCell;
