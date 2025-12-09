import { IdentityGroup } from '@key-management-service/types/identity.type';

import { DataGridTextCell } from '@ovh-ux/manager-react-components';

const IdentityGroupIdentityCell = (group: IdentityGroup) => {
  return <DataGridTextCell>{group.urn}</DataGridTextCell>;
};

export default IdentityGroupIdentityCell;
