import { useTranslation } from 'react-i18next';

import { BADGE_COLOR, Badge } from '@ovhcloud/ods-react';

import { TenantStatusProps } from '@/components/metrics/tenant-status/TenantStatus.props';
import { TenantResourceStatus } from '@/types/tenants.type';

const statusColorMap: Record<TenantResourceStatus, BADGE_COLOR> = {
  READY: BADGE_COLOR.success,
  ERROR: BADGE_COLOR.warning,
  UPDATING: BADGE_COLOR.information,
  DELETING: BADGE_COLOR.information,
  SUSPENDED: BADGE_COLOR.critical,
  CREATING: BADGE_COLOR.information,
  UNKNOWN: BADGE_COLOR.neutral,
};

export const TenantStatus = ({ status = 'UNKNOWN' }: TenantStatusProps) => {
  const { t } = useTranslation('tenants');
  return <Badge color={statusColorMap[status]}>{t(`tenants:status.${status}`)}</Badge>;
};

export default TenantStatus;
