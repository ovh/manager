import { useTranslation } from 'react-i18next';

import { BADGE_COLOR, Badge } from '@ovhcloud/ods-react';

import { ResourceBadgeStatusProps } from '@/components/services/status/ResourceBadgeStatus.props';
import { ResourceStatus } from '@/types/resource.type';

const statusColorMap: Record<ResourceStatus, BADGE_COLOR> = {
  READY: BADGE_COLOR.success,
  ERROR: BADGE_COLOR.warning,
  UPDATING: BADGE_COLOR.information,
  DELETING: BADGE_COLOR.information,
  SUSPENDED: BADGE_COLOR.critical,
  CREATING: BADGE_COLOR.information,
  UNKNOWN: BADGE_COLOR.neutral,
};

export const ResourceBadgeStatus = ({ status = 'UNKNOWN' }: ResourceBadgeStatusProps) => {
  const { t } = useTranslation('services');
  return <Badge color={statusColorMap[status]}>{t(`services:status.${status}`)}</Badge>;
};

export default ResourceBadgeStatus;
