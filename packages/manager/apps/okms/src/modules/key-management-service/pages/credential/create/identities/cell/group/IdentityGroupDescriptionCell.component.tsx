import { IdentityGroup } from '@key-management-service/types/identity.type';

import { DataGridTextCell } from '@ovh-ux/manager-react-components';

const IdentityGroupDescriptionCell = (group: IdentityGroup) => {
  return <DataGridTextCell>{group.description}</DataGridTextCell>;
};

export default IdentityGroupDescriptionCell;
