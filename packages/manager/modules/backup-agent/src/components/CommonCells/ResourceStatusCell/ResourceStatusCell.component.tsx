import { DataGridTextCell } from '@ovh-ux/manager-react-components';

import { ResourceStatusBadge } from '@/components/ResourceStatusBadge/ResourceStatusBadge.component';
import { ResourceWithStatus } from '@/types/Resource.type';

export const ResourceStatusCell = (resourceWithStatus: ResourceWithStatus) => {
  return (
    <DataGridTextCell>
      <ResourceStatusBadge vaultStatus={resourceWithStatus.resourceStatus} />
    </DataGridTextCell>
  );
};
