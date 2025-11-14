import React from 'react';
import { DataGridTextCell } from '@ovh-ux/manager-react-components';
import { IdentityOauthClient } from '@key-management-service/types/identity.type';

const IdentityServiceAccountNameCell = (
  serviceAccount: IdentityOauthClient,
) => {
  return <DataGridTextCell>{serviceAccount.name}</DataGridTextCell>;
};

export default IdentityServiceAccountNameCell;
