import { IdentityUser } from '@key-management-service/types/identity.type';

import { DataGridTextCell } from '@ovh-ux/manager-react-components';

const IdentityUserLoginCell = (user: IdentityUser) => {
  return <DataGridTextCell>{user.login}</DataGridTextCell>;
};

export default IdentityUserLoginCell;
