import React from 'react';

import { DataGridTextCell } from '@ovh-ux/manager-react-components';

import { ResourceStatusBadge } from '@/components/ResourceStatusBadge/ResourceStatusBadge.component';
import { ResourceStatus } from '@/types/Resource.type';

export type ResourceStatusBadgeProps = {
  resourceStatus: ResourceStatus;
};

export const ResourceStatusCell = ({ resourceStatus }: ResourceStatusBadgeProps) => {
  return (
    <DataGridTextCell>
      <ResourceStatusBadge resourceStatus={resourceStatus} />
    </DataGridTextCell>
  );
};
