import { Text } from '@ovhcloud/ods-react';

import { OrgDetails } from '@/data/api';

import { OrganisationsActionsCell } from '../DatagridCells';

export function DatagridActionCell(org: OrgDetails) {
  return (
    <Text>
      <OrganisationsActionsCell {...org} />
    </Text>
  );
}
