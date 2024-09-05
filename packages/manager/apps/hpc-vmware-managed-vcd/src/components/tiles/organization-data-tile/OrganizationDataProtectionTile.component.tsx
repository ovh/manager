import React from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { DashboardTile, Links, LinkType } from '@ovhcloud/manager-components';
import { OsdsChip, OsdsSkeleton } from '@ovhcloud/ods-components/react';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { ODS_CHIP_SIZE } from '@ovhcloud/ods-components';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import {
  DATA_PROTECTION_BACKUP_TITLE,
  DATA_PROTECTION_RECOVERY_TITLE,
} from '@/pages/dashboard/organization/OrganizationDashboard.constants';
import { useManagedVcdOrganizationBackup } from '@/data/hooks/useManagedVcdOrganization';
import { veeamBackupAppName } from '@/routes/routes.constant';
import { BackupResourceStatus } from '@/types/vcd-organization-backup.interface';

const colorByStatus: { [s in BackupResourceStatus]: ODS_THEME_COLOR_INTENT } = {
  CREATING: ODS_THEME_COLOR_INTENT.info,
  DISABLED: ODS_THEME_COLOR_INTENT.default,
  DISABLING: ODS_THEME_COLOR_INTENT.default,
  READY: ODS_THEME_COLOR_INTENT.success,
  REMOVED: ODS_THEME_COLOR_INTENT.error,
  UPDATING: ODS_THEME_COLOR_INTENT.info,
};

export default function DataProtectionTile() {
  const { t } = useTranslation('dashboard');
  const { id } = useParams();
  const { shell } = React.useContext(ShellContext);
  const {
    data: vcdBackup,
    isSuccess,
    isLoading,
    isError,
    error,
  } = useManagedVcdOrganizationBackup(id);
  const [veeamHref, setVeeamHref] = React.useState('');

  const hasNoBackup = error?.response?.status === 404;
  const backupStatus = vcdBackup?.data?.resourceStatus;

  React.useEffect(() => {
    shell.navigation
      .getURL(veeamBackupAppName, '', {})
      .then((url: string) => setVeeamHref(url));
  }, []);

  return (
    <div>
      <DashboardTile
        title={t('managed_vcd_dashboard_data_protection')}
        items={[
          {
            id: 'backup',
            label: DATA_PROTECTION_BACKUP_TITLE,
            value: (
              <div className="flex flex-col items-start">
                {/* TODO: check other ways to handle error (+refetch) inside a Tile
                (<ErrorBanner /> is too big to be used here) */}
                {isLoading && <OsdsSkeleton data-testid="backupLoading" />}
                {isError && (
                  <OsdsChip
                    inline
                    data-testid={hasNoBackup ? 'noBackup' : 'backupError'}
                    color={ODS_THEME_COLOR_INTENT.default}
                    size={ODS_CHIP_SIZE.sm}
                  >
                    {hasNoBackup
                      ? t('managed_vcd_dashboard_backup_status_none')
                      : t('managed_vcd_dashboard_backup_status_error')}
                  </OsdsChip>
                )}
                {isSuccess && (
                  <OsdsChip
                    inline
                    data-testid="backupStatus"
                    color={colorByStatus[backupStatus]}
                    size={ODS_CHIP_SIZE.sm}
                  >
                    {backupStatus}
                  </OsdsChip>
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
