import React from 'react';

import { ResourceWithStatus } from "@/types/Resource.type";

import { DataGridTextCell } from '@ovh-ux/manager-react-components';

import {ResourceStatusBadge} from "@/components/ResourceStatusBadge/ResourceStatusBadge.components";

export const ResourceStatusCell = (resourceWithStatus: ResourceWithStatus) => {
  return (
    <DataGridTextCell>
      <ResourceStatusBadge vaultStatus={resourceWithStatus.resourceStatus} />
    </DataGridTextCell>
  );
};
