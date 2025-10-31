import React from 'react';
import { DataGridTextCell } from '@ovh-ux/manager-react-components';
import { IdentityUser } from '@key-management-service/types/identity.type';

const IdentityUserLoginCell = (user: IdentityUser) => {
  return <DataGridTextCell>{user.login}</DataGridTextCell>;
};

export default IdentityUserLoginCell;
