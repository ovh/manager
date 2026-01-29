import { Outlet, NavLink, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Text, Tabs, Tab } from '@ovhcloud/ods-react';
import { useVpsDetail } from '@/api/hooks/useVpsDetail';
import { LoadingSkeleton } from '@/components/LoadingSkeleton/LoadingSkeleton.component';
import { VpsStateBadge } from '@/components/VpsStateBadge/VpsStateBadge.component';
import {
  getVpsDetailUrl,
  getSnapshotUrl,
  getVeeamUrl,
  getBackupStorageUrl,
  getMonitoringUrl,
  getMigrationUrl,
} from '@/routes/Routes.constants';

export const VpsDetailPage = () => {
  const { t } = useTranslation('vps');
  const { serviceName } = useParams<{ serviceName: string }>();

  const { data: vps, isLoading, isError } = useVpsDetail(serviceName ?? '');

  if (isLoading) {
    return (
      <div className="p-6">
        <LoadingSkeleton lines={3} />
      </div>
    );
  }

  if (isError || !vps) {
    return (
      <div className="p-6">
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <Text preset="paragraph" className="text-red-700">
            {t('common_error')}
          </Text>
        </div>
      </div>
    );
  }

  const tabs = [
    { label: t('vps_dashboard_title'), to: getVpsDetailUrl(serviceName!) },
    { label: t('vps_snapshot_title'), to: getSnapshotUrl(serviceName!) },
    { label: t('vps_veeam_title'), to: getVeeamUrl(serviceName!) },
    { label: t('vps_backup_storage_title'), to: getBackupStorageUrl(serviceName!) },
    { label: t('vps_monitoring_title'), to: getMonitoringUrl(serviceName!) },
    { label: t('vps_migration_title'), to: getMigrationUrl(serviceName!) },
  ];

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center gap-4">
        <Text preset="heading-2">{vps.displayName}</Text>
        <VpsStateBadge state={vps.state} />
      </div>

      {vps.displayName !== vps.serviceName && (
        <Text preset="paragraph" className="mb-4 text-gray-500">
          {vps.serviceName}
        </Text>
      )}

      <Tabs className="mb-6">
        {tabs.map((tab) => (
          <NavLink key={tab.to} to={tab.to} end={tab.to === getVpsDetailUrl(serviceName!)}>
            {({ isActive }) => (
              <Tab isSelected={isActive}>{tab.label}</Tab>
            )}
          </NavLink>
        ))}
      </Tabs>

      <Outlet />
    </div>
  );
};

export default VpsDetailPage;
