import { ODS_BADGE_COLOR } from '@ovhcloud/ods-components';

import { allResourceStatusColor } from '@/components/ResourceStatusBadge/_utils/resourceStatusColor.utils';
import { AgentStatus, ResourceStatus } from '@/types/Resource.type';

export const getColorResourceStatus = (status: ResourceStatus | AgentStatus) =>
  allResourceStatusColor[status.toUpperCase() as ResourceStatus] ?? ODS_BADGE_COLOR.information;
