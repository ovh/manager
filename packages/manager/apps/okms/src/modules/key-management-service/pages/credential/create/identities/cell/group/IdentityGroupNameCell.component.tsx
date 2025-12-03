import { IdentityGroup } from '@key-management-service/types/identity.type';

import { DataGridTextCell } from '@ovh-ux/manager-react-components';

const IdentityGroupNameCell = (group: IdentityGroup) => {
  return <DataGridTextCell>{group.name}</DataGridTextCell>;
};

export default IdentityGroupNameCell;
