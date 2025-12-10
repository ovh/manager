import { IdentityOauthClient } from '@key-management-service/types/identity.type';

import { DataGridTextCell } from '@ovh-ux/manager-react-components';

const IdentityServiceAccountNameCell = (serviceAccount: IdentityOauthClient) => {
  return <DataGridTextCell>{serviceAccount.name}</DataGridTextCell>;
};

export default IdentityServiceAccountNameCell;
