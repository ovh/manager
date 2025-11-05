import React from 'react';

import {ResourceStatus} from "@/types/Resource.type";

import { DataGridTextCell } from '@ovh-ux/manager-react-components';

import {ResourceStatusBadge} from "@/components/ResourceStatusBadge/ResourceStatusBadge.components";

export type ResourceStatusBadgeProps = {
  resourceStatus: ResourceStatus;
}

export const ResourceStatusCell = ({ resourceStatus }: ResourceStatusBadgeProps) => {
  return (
    <DataGridTextCell>
      <ResourceStatusBadge resourceStatus={resourceStatus} />
    </DataGridTextCell>
  );
};
