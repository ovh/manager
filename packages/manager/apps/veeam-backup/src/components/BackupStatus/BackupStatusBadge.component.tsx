import { useTranslation } from 'react-i18next';
import { ResourceStatus, VeeamBackup } from '@ovh-ux/manager-module-vcd-api';
import { OdsBadge } from '@ovhcloud/ods-components/react';
import { OdsBadgeColor } from '@ovhcloud/ods-components';

export type BackupStatusBadgeProps = {
  resourceStatus: ResourceStatus;
};

const colorByStatus: { [s in ResourceStatus]: OdsBadgeColor } = {
  READY: 'success',
  CREATING: 'information',
  DISABLED: 'neutral',
  DISABLING: 'information',
  REMOVED: 'neutral',
  UPDATING: 'information',
};

export const BackupStatusBadge = ({
  resourceStatus,
  className,
}: VeeamBackup & { className?: string }): JSX.Element => {
  const { t } = useTranslation('veeam-backup');

  return (
    <OdsBadge
      className={`whitespace-nowrap mt-1 ${className}`}
      color={colorByStatus[resourceStatus]}
      label={t(`status-${resourceStatus}`)}
    />
  );
};
