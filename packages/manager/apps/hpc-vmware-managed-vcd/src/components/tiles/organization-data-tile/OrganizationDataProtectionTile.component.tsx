import React from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { DashboardTile, Links, LinkType } from '@ovhcloud/manager-components';
import { OsdsChip } from '@ovhcloud/ods-components/react';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { ODS_CHIP_SIZE } from '@ovhcloud/ods-components';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import {
  DATA_PROTECTION_BACKUP_TITLE,
  DATA_PROTECTION_RECOVERY_TITLE,
} from '@/pages/dashboard/organization/OrganizationDashboard.constants';
import { useManagedVcdOrganizationBackup } from '@/data/hooks/useManagedVcdOrganization';
import Loading from '@/components/loading/Loading.component';
import { veeamBackupAppName } from '@/routes/routes.constant';

export default function DataProtectionTile() {
  const { t } = useTranslation('dashboard');
  const { id } = useParams();
  const { shell } = React.useContext(ShellContext);
  const { data: vcdBackup, isLoading } = useManagedVcdOrganizationBackup(id);
  const [veeamHref, setVeeamHref] = React.useState('');

  const backupStatus = vcdBackup?.data?.resourceStatus ?? 'error';

  React.useEffect(() => {
    shell.navigation
      .getURL(veeamBackupAppName, '', {})
      .then((url: string) => setVeeamHref(url));
  });

  return (
    <div>
      <DashboardTile
        title={t('managed_vcd_dashboard_data_protection')}
        items={[
          {
            id: 'backup',
            label: DATA_PROTECTION_BACKUP_TITLE,
            value: (
              <div className="flex flex-col">
                {/* TODO: check other ways to handle error (+refetch) inside a Tile
                (<ErrorBanner /> is too big to be used here) */}
                {isLoading && <Loading className="w-8" data-testid="loading" />}
                {!isLoading && (
                  <span data-testid="backupStatus">
                    {t(`managed_vcd_dashboard_backup_status_${backupStatus}`)}
                  </span>
                )}
                <Links
                  type={LinkType.external}
                  label={t('managed_vcd_dashboard_backup_link')}
                  href={veeamHref}
                />
              </div>
            ),
          },
          {
            id: 'recovery',
            label: DATA_PROTECTION_RECOVERY_TITLE,
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
