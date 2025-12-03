import { IdentityOauthClient } from '@key-management-service/types/identity.type';

import { DataGridTextCell } from '@ovh-ux/manager-react-components';

const IdentityServiceAccountIdentityCell = (serviceAccount: IdentityOauthClient) => {
  return <DataGridTextCell>{serviceAccount.identity}</DataGridTextCell>;
};

export default IdentityServiceAccountIdentityCell;
