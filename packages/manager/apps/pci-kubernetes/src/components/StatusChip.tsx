import { useTranslation } from 'react-i18next';

import { Badge, BadgeColor, SPINNER_SIZE, Spinner } from '@ovhcloud/ods-react';

import { ResourceStatus } from '@/types';

const StatusChip = ({ label }: { label: string }) => {
  const { t } = useTranslation('listing');
  const colorByProductStatus: Record<ResourceStatus, BadgeColor> = {
    [ResourceStatus.READY]: 'success',
    [ResourceStatus.DISABLED]: 'neutral',
    [ResourceStatus.UPDATING]: 'warning',
    [ResourceStatus.ERROR]: 'critical',
    [ResourceStatus.CREATING]: 'information',
    [ResourceStatus.ENABLED]: 'success',
    [ResourceStatus.DELETING]: 'critical',
  };

  const isValidResourceStatus = (value: string): value is ResourceStatus => {
    return value in colorByProductStatus;
  };

  if (!label) {
    return <Spinner size={SPINNER_SIZE.sm} />;
  }

  if (!isValidResourceStatus(label)) {
    return null;
  }

  return <Badge color={colorByProductStatus[label]}>{t(label)}</Badge>;
};

export default StatusChip;
