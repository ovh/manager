import React from 'react';
import { useTranslation } from 'react-i18next';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { Links, LinkType } from '@ovh-ux/manager-react-components';
import { ODS_CHIP_SIZE } from '@ovhcloud/ods-components';
import { OsdsChip, OsdsSkeleton } from '@ovhcloud/ods-components/react';
import {
  getBackupIdFromOrganization,
  useVeeamBackup,
  VCDOrganization,
} from '@ovh-ux/manager-module-vcd-api';
import { veeamBackupAppName } from '@/routes/routes.constant';
import {
  BackupBadgeParams,
  getBackupBadgeParams,
  getBackupBadgeStatus,
} from '@/utils/veeamBackupBadge';

type TTileProps = {
  vcdOrganization: VCDOrganization;
};

export default function BackupTileItem({
  vcdOrganization,
}: Readonly<TTileProps>) {
  const { t } = useTranslation('dashboard');
  const { shell } = React.useContext(ShellContext);
  const { data: vcdBackup, isLoading, error } = useVeeamBackup(
    getBackupIdFromOrganization(vcdOrganization),
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

  if (isLoading) return <OsdsSkeleton data-testid="backupLoading" />;

  return (
    <div className="flex flex-col items-start">
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
