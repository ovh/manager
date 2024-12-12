import React from 'react';
import { useTranslation } from 'react-i18next';
import { DashboardTile } from '@ovh-ux/manager-react-components';
import { OsdsChip } from '@ovhcloud/ods-components/react';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { ODS_CHIP_SIZE } from '@ovhcloud/ods-components';
import { VCDOrganization } from '@ovh-ux/manager-module-vcd-api';
import {
  DATA_PROTECTION_BACKUP_LABEL,
  DATA_PROTECTION_RECOVERY_LABEL,
} from '@/pages/dashboard/organization/organizationDashboard.constants';
import BackupTileItem from './backup-tile-item/BackupTileItem.component';

type TTileProps = {
  vcdOrganization: VCDOrganization;
};

export default function DataProtectionTile({
  vcdOrganization,
}: Readonly<TTileProps>) {
  const { t } = useTranslation('dashboard');

  return (
    <div>
      <DashboardTile
        title={t('managed_vcd_dashboard_data_protection')}
        items={[
          {
            id: 'backup',
            label: DATA_PROTECTION_BACKUP_LABEL,
            value: <BackupTileItem vcdOrganization={vcdOrganization} />,
          },
          {
            id: 'recovery',
            label: DATA_PROTECTION_RECOVERY_LABEL,
            value: (
              <OsdsChip
                inline
                color={ODS_THEME_COLOR_INTENT.primary}
                size={ODS_CHIP_SIZE.sm}
              >
                {t('managed_vcd_dashboard_coming_soon')}
              </OsdsChip>
            ),
          },
        ]}
      />
    </div>
  );
}
