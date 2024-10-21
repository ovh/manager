import React from 'react';
import { useTranslation } from 'react-i18next';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { OsdsChip } from '@ovhcloud/ods-components/react';
import { ODS_CHIP_SIZE } from '@ovhcloud/ods-components';
import { ResourceStatus, VeeamBackupWithIam } from '@/data';

export type BackupStatusBadgeProps = {
  resourceStatus: ResourceStatus;
};

const colorByStatus: { [s in ResourceStatus]: ODS_THEME_COLOR_INTENT } = {
  READY: ODS_THEME_COLOR_INTENT.success,
  CREATING: ODS_THEME_COLOR_INTENT.info,
  DISABLED: ODS_THEME_COLOR_INTENT.default,
  DISABLING: ODS_THEME_COLOR_INTENT.info,
  REMOVED: ODS_THEME_COLOR_INTENT.default,
  UPDATING: ODS_THEME_COLOR_INTENT.info,
};

export const BackupStatusBadge = ({
  resourceStatus,
  className,
}: VeeamBackupWithIam & { className?: string }): JSX.Element => {
  const { t } = useTranslation('veeam-backup');
  const color = colorByStatus[resourceStatus];

  return (
    <OsdsChip
      className={`whitespace-nowrap ${className}`}
      inline
      color={color}
      size={ODS_CHIP_SIZE.sm}
    >
      {t(`status-${resourceStatus}`)}
    </OsdsChip>
  );
};
