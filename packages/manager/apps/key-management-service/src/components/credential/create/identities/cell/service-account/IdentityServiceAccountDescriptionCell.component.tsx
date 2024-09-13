import React from 'react';
import { DataGridTextCell } from '@ovh-ux/manager-react-components';
import { IdentityOauthClient } from '@/types/identity.type';

const IdentityServiceAccountDescriptionCell = (
  serviceAccount: IdentityOauthClient,
) => {
  return <DataGridTextCell>{serviceAccount.description}</DataGridTextCell>;
};

export default IdentityServiceAccountDescriptionCell;
