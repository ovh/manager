import { useTranslation } from 'react-i18next';

import { OdsBadgeColor } from '@ovhcloud/ods-components';
import { OdsBadge } from '@ovhcloud/ods-components/react';

import { VrackSegmentResourceStatus } from '@ovh-ux/manager-module-vcd-api';

export function getVrackSegmentColorFromResourceStatus(
  resourceStatus: VrackSegmentResourceStatus,
): OdsBadgeColor {
  const colorResourceStatusMapping: Partial<Record<VrackSegmentResourceStatus, OdsBadgeColor>> = {
    READY: 'success',
    ERROR: 'critical',
    SUSPENDED: 'warning',
  };

  return colorResourceStatusMapping[resourceStatus] ?? 'information';
}

export const VrackSegmentStatusBadge = ({
  resourceStatus,
}: {
  resourceStatus: VrackSegmentResourceStatus;
}) => {
  const { t } = useTranslation('datacentres/vrack-segment');

  return (
    <OdsBadge
      color={getVrackSegmentColorFromResourceStatus(resourceStatus)}
      label={t(`managed_vcd_dashboard_vrack_status_${resourceStatus.toLowerCase()}`)}
    ></OdsBadge>
  );
};
