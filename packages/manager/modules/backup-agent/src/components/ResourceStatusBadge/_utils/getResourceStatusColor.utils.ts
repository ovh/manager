import { ODS_BADGE_COLOR } from '@ovhcloud/ods-components';

import { vaultStatusColor } from '@/components/ResourceStatusBadge/_utils/resourceStatusColor.utils';
import { AgentStatus, ResourceStatus } from '@/types/Resource.type';

export const getColorResourceStatus = (status: ResourceStatus | AgentStatus) =>
  vaultStatusColor[status.toUpperCase() as ResourceStatus] ?? ODS_BADGE_COLOR.information;
