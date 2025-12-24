import React from 'react';

import { DataGridTextCell } from '@ovh-ux/manager-react-components';

import { OrgDetails } from '@/data/api';

import { OrganisationsAddressCell } from '../DatagridCells';

export function DatagridAddressCell(org: OrgDetails) {
  return (
    <DataGridTextCell>
      <OrganisationsAddressCell {...org} />
    </DataGridTextCell>
  );
}
