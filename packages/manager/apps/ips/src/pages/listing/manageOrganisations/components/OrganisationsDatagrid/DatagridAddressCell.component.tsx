import { Text } from '@ovhcloud/ods-react';

import { OrgDetails } from '@/data/api';

import { OrganisationsAddressCell } from '../DatagridCells';

export function DatagridAddressCell(org: OrgDetails) {
  return (
    <Text>
      <OrganisationsAddressCell {...org} />
    </Text>
  );
}
