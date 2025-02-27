import { useTranslation } from 'react-i18next';
import { OdsBadge } from '@ovhcloud/ods-components/react';
import { OdsBadgeColor } from '@ovhcloud/ods-components';
import { DataGridTextCell, Region } from '@ovh-ux/manager-react-components';
import {
  BackupStatus,
  VCDOrganizationWithBackupStatus,
  getOrganizationDisplayName,
} from '@ovh-ux/manager-module-vcd-api';

const colorByStatus: { [s in BackupStatus]: OdsBadgeColor } = {
  active: 'success',
  none: 'neutral',
  error: 'critical',
};

export const BackupStatusCell = (org: VCDOrganizationWithBackupStatus) => {
  const { t } = useTranslation('order-veeam');
  return (
    <OdsBadge
      color={colorByStatus[org?.backupStatus]}
      label={t(`${org?.backupStatus}_status`)}
    />
  );
};

export const NameCell = (org: VCDOrganizationWithBackupStatus) => (
  <DataGridTextCell>{getOrganizationDisplayName(org)}</DataGridTextCell>
);

export const RegionCell = (org: VCDOrganizationWithBackupStatus) => (
  <DataGridTextCell>{org?.currentState?.region.toLowerCase()}</DataGridTextCell>
);

export const LocationCell = (org: VCDOrganizationWithBackupStatus) => (
  <DataGridTextCell>
    <Region mode="region" name={org?.currentState?.region.toLowerCase()} />
  </DataGridTextCell>
);

export const DescriptionCell = (org: VCDOrganizationWithBackupStatus) => (
  <DataGridTextCell>{org?.currentState?.description}</DataGridTextCell>
);
