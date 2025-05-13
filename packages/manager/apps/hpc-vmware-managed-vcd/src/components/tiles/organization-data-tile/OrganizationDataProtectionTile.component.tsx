import React from 'react';
import { useTranslation } from 'react-i18next';
import { DashboardTile } from '@ovh-ux/manager-react-components';
import { OdsBadge } from '@ovhcloud/ods-components/react';
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
              <OdsBadge
                label={t('managed_vcd_dashboard_coming_soon')}
                className="mt-3"
              />
            ),
          },
        ]}
      />
    </div>
  );
}
