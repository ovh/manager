import { ODS_BADGE_COLOR } from '@ovhcloud/ods-components';

import { AgentStatus, ResourceStatus } from '@/types/Resource.type';

export const vaultStatusColor: Record<ResourceStatus | AgentStatus, ODS_BADGE_COLOR> = {
  CREATING: ODS_BADGE_COLOR.information,
  DELETING: ODS_BADGE_COLOR.critical,
  ERROR: ODS_BADGE_COLOR.critical,
  READY: ODS_BADGE_COLOR.success,
  SUSPENDED: ODS_BADGE_COLOR.warning,
  UPDATING: ODS_BADGE_COLOR.information,
  DISABLED: ODS_BADGE_COLOR.critical,
  ENABLED: ODS_BADGE_COLOR.success,
  NOT_CONFIGURED: ODS_BADGE_COLOR.information,
  NOT_INSTALLED: ODS_BADGE_COLOR.information,
};
