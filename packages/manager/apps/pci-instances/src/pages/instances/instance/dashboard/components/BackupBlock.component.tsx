import { FC } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import DashboardCardLayout from './DashboardCardLayout.component';
import { Badge, Icon, Link, Text } from '@ovhcloud/ods-react';
import { useTranslation } from 'react-i18next';
import { useDashboard } from '../hooks/useDashboard';
import { useInstanceParams } from '@/pages/instances/action/hooks/useInstanceActionModal';
import { DashboardTileBlock } from './tile/DashboardTile.component';

const BackupBlock: FC = () => {
  const { t } = useTranslation(['dashboard', 'list']);
  const { instanceId, region } = useInstanceParams();
  const { instance, isPending } = useDashboard({ region, instanceId });

  return (
    <DashboardCardLayout title={t('pci_instances_dashboard_backup_title')}>
      <DashboardTileBlock
        isLoading={isPending}
        label={t('pci_instances_dashboard_backup_number_of_backups')}
      >
        {instance?.backupsInfo ? (
          <Text className="py-4">{instance.backupsInfo.total}</Text>
        ) : (
          <Badge color="critical" className="my-4">
            {t('pci_instances_dashboard_backup_empty_message')}
          </Badge>
        )}
      </DashboardTileBlock>
      {instance?.backupsInfo?.lastUpdated && (
        <DashboardTileBlock
          label={t('pci_instances_dashboard_backup_last_updated_backups')}
          withoutDivider
        >
          <Text className="py-4">{instance.backupsInfo.lastUpdated}</Text>
        </DashboardTileBlock>
      )}
      {instance?.isBackupEnabled && (
        <Link as={RouterLink} to={`../${instanceId}/backup?region=${region}`}>
          {t('list:pci_instances_list_action_create_backup')}
          <Icon name="arrow-right" />
        </Link>
      )}
    </DashboardCardLayout>
  );
};

export default BackupBlock;
