import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  ShellContext,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import { Links, LinkType } from '@ovh-ux/manager-react-components';
import { OdsSkeleton, OdsBadge } from '@ovhcloud/ods-components/react';
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
import TEST_IDS from '@/utils/testIds.constants';
import { TRACKING } from '@/tracking.constants';

type TTileProps = {
  vcdOrganization: VCDOrganization;
};

export default function BackupTileItem({
  vcdOrganization,
}: Readonly<TTileProps>) {
  const { t } = useTranslation('dashboard');
  const { shell } = React.useContext(ShellContext);
  const { trackClick } = useOvhTracking();
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

  return (
    <div className="flex flex-col items-start">
      <div>
        {isLoading ? (
          <OdsSkeleton data-testid={TEST_IDS.backupBadgeLoading} />
        ) : (
          <OdsBadge
            label={t(badgeParams.translationKey)}
            data-testid={badgeParams.testIdLabel}
            className="my-3"
            color={badgeParams.color}
          />
        )}
      </div>
      <Links
        type={LinkType.external}
        label={t('managed_vcd_dashboard_backup_link')}
        href={veeamHref}
        data-testid={TEST_IDS.dashboardVeeamBackupLink}
        onClickReturn={() => trackClick(TRACKING.dashboard.goToManageBackup)}
      />
    </div>
  );
}
