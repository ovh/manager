import React from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { Links, LinkType } from '@ovh-ux/manager-react-components';
import { ODS_CHIP_SIZE } from '@ovhcloud/ods-components';
import { OsdsChip, OsdsSkeleton } from '@ovhcloud/ods-components/react';
import { veeamBackupAppName } from '@/routes/routes.constant';
import { useManagedVcdOrganizationBackup } from '@/data/hooks/useManagedVcdOrganization';
import {
  BackupBadgeParams,
  getBackupBadgeParams,
  getBackupBadgeStatus,
} from '@/utils/getBackupBadge';

export default function BackupTileItem() {
  const { id } = useParams();
  const { t } = useTranslation('dashboard');
  const { shell } = React.useContext(ShellContext);
  const { data: vcdBackup, isLoading, error } = useManagedVcdOrganizationBackup(
    id,
  );
  const [veeamHref, setVeeamHref] = React.useState('');
  const badgeParams: BackupBadgeParams = getBackupBadgeParams(
    getBackupBadgeStatus({
      errorStatus: error?.response?.status,
      backupStatus: vcdBackup?.data?.resourceStatus,
    }),
  );

  React.useEffect(() => {
    shell.navigation
      .getURL(veeamBackupAppName, '', {})
      .then((url: string) => setVeeamHref(url));
  }, []);

  return (
    <div className="flex flex-col items-start">
      {isLoading && <OsdsSkeleton data-testid="backupLoading" />}
      <OsdsChip
        inline
        data-testid={badgeParams.testIdLabel}
        color={badgeParams.color}
        size={ODS_CHIP_SIZE.sm}
      >
        {t(badgeParams.translationKey)}
      </OsdsChip>
      <Links
        type={LinkType.external}
        label={t('managed_vcd_dashboard_backup_link')}
        href={veeamHref}
      />
    </div>
  );
}
