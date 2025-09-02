import React from 'react';
import { DataGridTextCell } from '@ovh-ux/manager-react-components';
import { IdentityOauthClient } from '@/types/identity.type';

const IdentityServiceAccountIdentityCell = (
  serviceAccount: IdentityOauthClient,
) => {
  return <DataGridTextCell>{serviceAccount.identity}</DataGridTextCell>;
};

export default IdentityServiceAccountIdentityCell;
