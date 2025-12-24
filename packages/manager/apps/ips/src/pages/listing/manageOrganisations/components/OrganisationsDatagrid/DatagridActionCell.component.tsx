import React from 'react';

import { DataGridTextCell } from '@ovh-ux/manager-react-components';

import { OrgDetails } from '@/data/api';

import { OrganisationsActionsCell } from '../DatagridCells';

export function DatagridActionCell(org: OrgDetails) {
  return (
    <DataGridTextCell>
      <OrganisationsActionsCell {...org} />
    </DataGridTextCell>
  );
}
