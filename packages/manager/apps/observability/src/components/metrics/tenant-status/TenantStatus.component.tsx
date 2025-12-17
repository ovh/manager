import { useTranslation } from 'react-i18next';

import { BADGE_COLOR, Badge } from '@ovhcloud/ods-react';

import { TenantStatusProps } from '@/components/metrics/tenant-status/TenantStatus.props';
import { TenantResourceStatus } from '@/types/tenants.type';

const statusColorMap: Record<TenantResourceStatus, BADGE_COLOR> = {
  READY: BADGE_COLOR.success,
  ERROR: BADGE_COLOR.critical,
  UPDATING: BADGE_COLOR.warning,
  DELETING: BADGE_COLOR.warning,
  SUSPENDED: BADGE_COLOR.warning,
  CREATING: BADGE_COLOR.warning,
  UNKNOWN: BADGE_COLOR.neutral,
};

export const TenantStatus = ({ status }: TenantStatusProps) => {
  const { t } = useTranslation('tenants');
  return <Badge color={statusColorMap[status]}>{t(`tenants:status.${status}`)}</Badge>;
};

export default TenantStatus;
