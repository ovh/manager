import { ODS_BADGE_COLOR } from '@ovhcloud/ods-components';

import { AgentStatus, ResourceStatus } from '@/types/Resource.type';

export const agentStatusColor: Record<AgentStatus, ODS_BADGE_COLOR> = Object.freeze({
  CREATING: ODS_BADGE_COLOR.information,
  UPDATING: ODS_BADGE_COLOR.information,
  DISABLED: ODS_BADGE_COLOR.critical,
  ENABLED: ODS_BADGE_COLOR.success,
  NOT_CONFIGURED: ODS_BADGE_COLOR.information,
  NOT_INSTALLED: ODS_BADGE_COLOR.information,
});

export const resourceStatusColor: Record<ResourceStatus, ODS_BADGE_COLOR> = Object.freeze({
  CREATING: ODS_BADGE_COLOR.information,
  DELETING: ODS_BADGE_COLOR.critical,
  ERROR: ODS_BADGE_COLOR.critical,
  READY: ODS_BADGE_COLOR.success,
  SUSPENDED: ODS_BADGE_COLOR.warning,
  UPDATING: ODS_BADGE_COLOR.information,
  DISABLED: ODS_BADGE_COLOR.critical,
  ENABLED: ODS_BADGE_COLOR.success,
});

export const allResourceStatusColor = Object.freeze({
  ...resourceStatusColor,
  ...agentStatusColor,
});
