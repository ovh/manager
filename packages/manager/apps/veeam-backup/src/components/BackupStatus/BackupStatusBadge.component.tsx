import { useTranslation } from 'react-i18next';
import {
  BackupResourceStatus,
  VeeamBackup,
} from '@ovh-ux/manager-module-vcd-api';
import { OdsBadge } from '@ovhcloud/ods-components/react';
import { OdsBadgeColor } from '@ovhcloud/ods-components';

export type BackupStatusBadgeProps = {
  resourceStatus: BackupResourceStatus;
};

const colorByStatus: { [s in BackupResourceStatus]: OdsBadgeColor } = {
  READY: 'success',
  CREATING: 'information',
  DISABLED: 'neutral',
  DISABLING: 'information',
  REMOVED: 'neutral',
  REMOVING: 'neutral',
  UPDATING: 'information',
};

export const BackupStatusBadge = ({
  resourceStatus,
  className,
}: Pick<VeeamBackup, 'resourceStatus'> & {
  className?: string;
}): JSX.Element => {
  const { t } = useTranslation('veeam-backup');

  return (
    <OdsBadge
      className={`whitespace-nowrap mt-1 ${className}`}
      color={colorByStatus[resourceStatus]}
      label={t(`status-${resourceStatus}`)}
    />
  );
};
