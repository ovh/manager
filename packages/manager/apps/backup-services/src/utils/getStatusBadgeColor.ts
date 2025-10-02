import { OdsBadgeColor } from '@ovhcloud/ods-components';

import { ApiResourceStatus } from '@/types/ApiGeneric.type';

const statusColors: Record<ApiResourceStatus, OdsBadgeColor> = {
  CREATING: 'information',
  DELETING: 'critical',
  ERROR: 'critical',
  READY: 'success',
  SUSPENDED: 'warning',
  UPDATING: 'information',
};

export const getStatusBadgeColor = (status: ApiResourceStatus) =>
  statusColors[status] ?? 'information';
