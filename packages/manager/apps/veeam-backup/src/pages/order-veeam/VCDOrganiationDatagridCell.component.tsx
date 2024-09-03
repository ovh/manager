import React from 'react';
import { useTranslation } from 'react-i18next';
import { OsdsChip } from '@ovhcloud/ods-components/react';
import { ODS_CHIP_SIZE } from '@ovhcloud/ods-components';
import { DataGridTextCell } from '@ovhcloud/manager-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  VCDOrganizationWithBackupStatus,
  getOrganizationDisplayName,
} from '@/data';

const colorByStatus = {
  active: ODS_THEME_COLOR_INTENT.success,
  none: ODS_THEME_COLOR_INTENT.default,
  error: ODS_THEME_COLOR_INTENT.error,
};

export const BackupStatusCell = (org: VCDOrganizationWithBackupStatus) => {
  const { t } = useTranslation('order-veeam');
  return (
    <OsdsChip
      inline
      color={colorByStatus[org?.backupStatus]}
      size={ODS_CHIP_SIZE.sm}
    >
      {t(`${org?.backupStatus}_status`)}
    </OsdsChip>
  );
};

export const NameCell = (org: VCDOrganizationWithBackupStatus) => (
  <DataGridTextCell>{getOrganizationDisplayName(org)}</DataGridTextCell>
);

export const RegionCell = (org: VCDOrganizationWithBackupStatus) => (
  <DataGridTextCell>{org?.currentState?.region}</DataGridTextCell>
);

export const DescriptionCell = (org: VCDOrganizationWithBackupStatus) => (
  <DataGridTextCell>{org?.currentState?.description}</DataGridTextCell>
);
